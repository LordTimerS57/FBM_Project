import numpy as np
from fractions import Fraction

# Fonction pour calculer un "Big M" suffisamment grand pour les variables artificielles
def get_bigM(A):
    max_val = np.nanmax(np.abs(A))
    
    # On multiplie par 1000 pour s'assurer qu'il domine largement
    return max_val * 1000

# Calcul des coûts réduits (Delta) : Cj - somme(Ci * Aij) pour chaque variable j
def delta(A, C, V_C):
    # Calcul des coûts réduits : Cj - somme(Ci * Aij)
    # On utilise le produit matriciel @ pour plus de simplicité
    list_d = C - (V_C[:, 0] @ A)
    list_d[0] = -list_d[0]
    
    return list_d

# Trouver le pivot : on cherche la ligne avec le ratio minimum (b_i / a_ij) pour les a_ij > 0
def find_pivot(A, pole):
    # On ne regarde que les valeurs strictement positives pour le pivot
    values_denominator = A[:, pole]
    values_numerator = A[:, 0]

    # On convertit tes listes en arrays NumPy
    num = np.array(values_numerator)
    den = np.array(values_denominator)
    epsilon = 1e-19

    # On pré-remplit un tableau de 'inf'
    ratios = np.full_like(num, np.inf, dtype=float)

    # On crée un masque pour les dénominateurs valides (strictement positifs)
    # Dans le Simplexe, on ne peut pivoter que sur des valeurs > 0
    mask_den = den > 0

    # On effectue la division SEULEMENT là où c'est possible
    # Pour les numérateurs == 0
    mask_zero_num = (num == 0) & mask_den
    ratios[mask_zero_num] = epsilon / den[mask_zero_num]

    # Pour les numérateurs > 0
    mask_pos_num = (num > 0) & mask_den
    ratios[mask_pos_num] = num[mask_pos_num] / den[mask_pos_num]    

    # On trouve l'indice du minimum parmi les ratios cohérents
    index = np.argmin(ratios)

    value = A[index, pole]

    return index, value

# Fonction principale du Simplex
def simplex(A, C, Ci):
    iA, jA = A.shape

    while True:
        # 1. Calcul des Delta
        delta_list = delta(A, C, Ci)

        # 2. Sélection du pôle (variable entrante)
        # On regarde les colonnes de 1 à fin (on exclut la colonne 0 du RHS)
        candidates = delta_list[1:]

        # On prend l'indice du max des candidats + 1 (car on a slice à partir de 1)
        index_pole = np.argmax(candidates) + 1

        if delta_list[index_pole] <= 0:
            print("Optimalité atteinte.")
            break

        # 3. Trouver le pivot
        index_pivot, pivot_val = find_pivot(A, index_pole)

        # 4. Mise à jour de la ligne du pivot (Normalisation)
        A[index_pivot, :] /= pivot_val

        # 5. Mise à jour de la base (Ci)
        Ci[index_pivot, 0] = C[index_pole]
        Ci[index_pivot, 1] = index_pole

        # 6. Mise à jour des autres lignes de la matrice A
        for i in range(iA):
            if i != index_pivot:
                facteur = A[i, index_pole]
                A[i, :] = A[i, :] - facteur * A[index_pivot, :]
        
    return Ci, A[:, 0], delta_list[0]

def generate_Ci_structured(C, processed_constraints, n_vars, n_slacks):
    n_rows = len(processed_constraints)
    # Matrice Ci : k lignes, 2 colonnes (Valeur du Coeff, Indice original)
    Ci = np.zeros((n_rows, 2), dtype=Fraction)
    
    slack_start_idx = 1 + n_vars
    artif_start_idx = 1 + n_vars + n_slacks
    
    artif_count = 0
    # On parcourt les contraintes pour remplir suivant vos priorités
    for i, c in enumerate(processed_constraints):
        if c['type'] == '>=':
            # PRIORITÉ 1 : Variable artificielle
            idx_a = artif_start_idx + artif_count
            Ci[i, 0] = C[idx_a] # Valeur (ex: -M)
            Ci[i, 1] = idx_a           # Indice i
            artif_count += 1       
        else:              
            # PRIORITÉ 2 : Variable d'écart (pour les lignes <=)
            idx_e = slack_start_idx + i
            Ci[i, 0] = C[idx_e] # Valeur (0)
            Ci[i, 1] = idx_e           # Indice i
            
    return Ci

# --------------------------------------------- Préparation des matrices A et C à partir des données d'entrée (des énoncés) ---------------------------------------------

def transform_to_matrices(objectives, constraints, mode='MAX'):
    # 1. Identifier les variables d'origine (x1, x2...) et leur ordre
    original_vars = sorted(list(objectives.keys()))
    n_vars = len(original_vars)
    
    # 2. Procéder à la transformation des contraintes en respectant les règles d'ajout de variables d'écart et artificielles
    processed_constraints = []
    for c in constraints:
        if c['type'] == '=':
            # Role des contraintes d'égalité : on les découpe en deux inégalités
            c_low = c.copy(); c_low['type'] = '<='
            c_high = c.copy(); c_high['type'] = '>='
            processed_constraints.extend([c_low, c_high])
        else:
            processed_constraints.append(c)
            
    n_rows = len(processed_constraints)
    
    # 3. Compter le nombre de variables d'écart et artificielles nécessaires
    n_slacks = n_rows
    # Role des variables artificielles : une par contrainte '>='
    n_artificials = sum(1 for c in processed_constraints if c['type'] == '>=')
    
    # Total largeur de la matrice A et longueur de la matrice C: 1 (pour b) + n_vars (x1, x2...) + n_slacks + n_artificials
    total_width = 1 + n_vars + n_slacks + n_artificials
    matrix_A = np.zeros((n_rows, total_width), dtype=Fraction)
    
    # 4. Créer la système de matrices A en respectant les règles d'indexation
    slack_col_idx = 1 + n_vars
    artif_col_idx = 1 + n_vars + n_slacks
    
    for i, c in enumerate(processed_constraints):
        # Règle pour b (RHS)
        matrix_A[i, 0] = c['b']
        
        # Coefficients pour les variables d'origine (x1, x2...)
        for j, var in enumerate(original_vars):
            matrix_A[i, j + 1] = c['coeffs'].get(var, 0)
            
        # Règles pour les constantes d'écart et artificielles
        if c['type'] == '<=':
            matrix_A[i, slack_col_idx] = 1
            slack_col_idx += 1
        elif c['type'] == '>=':
            matrix_A[i, slack_col_idx] = -1 # variable d'écart -1
            matrix_A[i, artif_col_idx] = 1  # variable artificielle 1
            slack_col_idx += 1
            artif_col_idx += 1

    # 5. Remplir la matrice C pour les variables d'origine et les variables d'écart/artificielles
    matrix_C = np.zeros(total_width, dtype=Fraction)
    M = get_bigM(matrix_A)
    
    # Règle de signe pour MIN -> MAX
    sign_multiplier = -1 if mode.upper() == 'MIN' else 1

    for j, var in enumerate(original_vars):
    # On ne change le signe que pour les variables x1, x2...
        matrix_C[j + 1] = objectives.get(var, 0) * sign_multiplier

    # 5. Gestion des variables artificielles dans C (Big M)
    # En MAX, les variables artificielles doivent avoir une pénalité très lourde (-M)
    # pour forcer l'algorithme à les rendre nulles.
    current_artif_idx = 1 + n_vars + n_slacks
    for _ in range(n_artificials):
        matrix_C[current_artif_idx] = -M 
        current_artif_idx += 1

    # 6. Ajouter la matrice Ci structurée pour le solveur Simplex
    matrix_Ci = generate_Ci_structured(matrix_C, processed_constraints, n_vars, n_slacks)
    
    return matrix_A, matrix_C, matrix_Ci

# --------------------------------------------- Fin de la préparation des matrices A et C ---------------------------------------------

# --------------------------------------------- Solveur Simplex ---------------------------------------------

def solve_simplex(objectives, constraints, mode='MAX'):
    # 1. Préparation des matrices
    a, c, ci = transform_to_matrices(objectives, constraints, mode)
    
    # On garde une copie des variables originales pour le dictionnaire final
    original_vars = sorted(list(objectives.keys()))
    
    # 2. Exécution du Simplex
    # Note : votre fonction simplex retourne (Ci, A_col0, delta_0)
    final_ci, final_rhs, final_z = simplex(a, c, ci)
    
    # 3. Construction du dictionnaire de résultats
    # On initialise toutes les variables d'origine à 0
    results = {var: 0.0 for var in original_vars}
    
    # Parcourir la base (final_ci) pour trouver les valeurs des variables
    # Rappel : final_ci[i, 1] est l'indice de la variable, final_rhs[i] est sa valeur
    for i in range(len(final_ci)):
        idx_variable = int(final_ci[i, 1])
        
        # On vérifie si cet indice correspond à une variable x1, x2...
        # Dans votre logique : x1 est à l'indice 1, x2 à l'indice 2, etc.
        if 1 <= idx_variable <= len(original_vars):
            var_name = original_vars[idx_variable - 1]
            results[var_name] = float(final_rhs[i])

    # 4. Calcul de Z
    # Si c'est un MIN, on a inversé les signes dans C, donc on ré-inverse pour l'affichage
    results['z'] = float(final_z) if mode == 'MAX' else -float(final_z)
    
    return results
# --------------------------------------------- Fin du Solveur Simplex ---------------------------------------------

# --- Tests ---

# Test 0 : Cas de base avec une contrainte d'égalité (qui sera transformée en deux inégalités)
print("Cas 0")

# Maximiser Z = 3x1 + 5x2
obj_functions = {'x1': 3, 'x2': 5}

# Liste de contraintes :
constraints_list = [
    {'coeffs': {'x1': 1, 'x2': 0}, 'type': '<=', 'b': 4},
    {'coeffs': {'x1': 0, 'x2': 2}, 'type': '>=', 'b': 12},
    {'coeffs': {'x1': 3, 'x2': 2}, 'type': '=', 'b': 18} # Will be split
]
# Résultat attendu : x1 = 0, x2 = 9, z = 45
print("\nRésultat final (dictionnaire) :\n", solve_simplex(obj_functions, constraints_list, mode='MAX'))

# Test 1 : Cas plus complexe avec plusieurs variables et contraintes
print("Cas 1")

# Maximiser Z = 4x1 + 12x2 + 3x3
obj_functions_1 = {
    'x1': 4, 
    'x2': 12, 
    'x3': 3
}

# Liste de contraintes :
constraints_list_1 = [
    {'coeffs': {'x1': 1, 'x2': 0, 'x3': 0}, 'type': '<=', 'b': 1000},
    {'coeffs': {'x1': 0, 'x2': 1, 'x3': 0}, 'type': '<=', 'b': 500},
    {'coeffs': {'x1': 0, 'x2': 0, 'x3': 1}, 'type': '<=', 'b': 1500},
    {'coeffs': {'x1': 3, 'x2': 6, 'x3': 2}, 'type': '<=', 'b': 6750}
]

print("\nRésultat final (dictionnaire) :\n", solve_simplex(obj_functions_1, constraints_list_1, mode='MAX'))

print("Cas 2")

# Maximiser Z = 420x1 + 510x2 + 360x3
obj_functions_2 = {
    'x1': 420, 
    'x2': 510, 
    'x3': 360
}

# Liste de contraintes :
constraints_list_2 = [
    {'coeffs': {'x1': 1, 'x2': 1, 'x3': 1}, 'type': '<=', 'b': 40},
    {'coeffs': {'x1': 1500, 'x2': 1800, 'x3': 1050}, 'type': '<=', 'b': 63000},
    {'coeffs': {'x1': 18, 'x2': 27, 'x3': 15}, 'type': '<=', 'b': 840}
]

# Résultat attendu : x1 = 160/7, x2 = 100/7, x3 = 20/7, z = 125400/7
print("\nRésultat final (dictionnaire) :\n", solve_simplex(obj_functions_2, constraints_list_2, mode='MAX'))

# Test 3 : Cas avec minimisation
print("Cas 3")

# Minimiser Z = 2x1 + 3x2
obj_functions_3 = {
    'x1': 2, 
    'x2': 3 
}

# Liste de contraintes :
constraints_list_3 = [
    {'coeffs': {'x1': 4, 'x2': 1}, 'type': '>=', 'b': 8},
    {'coeffs': {'x1': 1, 'x2': 4}, 'type': '>=', 'b': 8},
    {'coeffs': {'x1': 7, 'x2': 10}, 'type': '>=', 'b': 47}
]

# Résultat attendu : x1 = 6, x2 = 1/2, z = 27/2
print("\nRésultat final (dictionnaire) :\n", solve_simplex(obj_functions_3, constraints_list_3, mode='MIN'))