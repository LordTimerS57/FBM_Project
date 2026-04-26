import numpy as np
from fractions import Fraction

def get_bigM(A):
    max_val = np.nanmax(np.abs(A))
    
    # On multiplie par 1000 pour s'assurer qu'il domine largement
    return max_val * 1000

def delta(A, C, V_C):
    # Calcul des coûts réduits : Cj - somme(Ci * Aij)
    # On utilise le produit matriciel @ pour plus de simplicité
    M = get_bigM(A)

    list_d = C - (V_C[:, 0] @ A)
    list_d[0] = -list_d[0]
    
    return list_d

def find_pivot(A, pole):
    # On ne regarde que les valeurs strictement positives pour le pivot
    values_denominator = A[:, pole]
    values_numerator = A[:, 0]

    # On convertit tes listes en arrays NumPy
    num = np.array(values_numerator)
    den = np.array(values_denominator)
    epsilon = 1e-9

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

def simplex(A, C, Ci):
    iA, jA = A.shape
    M = get_bigM(A)
    
    k = 0
    while True:
        # 1. Calcul des Delta
        delta_list = delta(A, C, Ci)

        # 2. Sélection du pôle (variable entrante)
        # On regarde les colonnes de 1 à fin (on exclut la colonne 0 du RHS)
        candidates = delta_list[1:]
        print("\nDelta J :\n", k ,delta_list)

        k+=1

        # On prend l'indice du max des candidats + 1 (car on a slice à partir de 1)
        index_pole = np.argmax(candidates) + 1
        
        print("Pôle sélectionné (variable entrante) : index", index_pole, "avec Delta =", delta_list[index_pole])

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
        
    return Ci, A[:, 0]

def solve_simplex(subject_to, objective, initial_base):
    # Préparation de la matrice A
    
    num_constraints = len(subject_to)
    num_variables = len(objective)
    num_slack = num_constraints
    
    coefficients_a = np.zeros((num_constraints, 1 + num_variables + num_slack), dtype=Fraction)
    
    simplex(coefficients_a, objective, initial_base)

# --- Test ---
print("Test du solveur Simplex 1")

a1 = np.array([
    [1000, 1, 0, 0, 1, 0, 0, 0],
    [500,  0, 1, 0, 0, 1, 0, 0],
    [1500, 0, 0, 1, 0, 0, 1, 0],
    [6750, 3, 6, 2, 0, 0, 0, 1]
], dtype=Fraction)

c1 = np.array([0, 4, 12, 3, 0, 0, 0, 0], dtype=Fraction)

ci1 = np.array([
    [0, 4], # e1 (index 4)
    [0, 5], # e2 (index 5)
    [0, 6], # e3 (index 6)
    [0, 7]  # e4 (index 7)
], dtype=Fraction)

Ci_final1, A0_final1 = simplex(a1, c1, ci1)

print("\nCi, i final :\n", Ci_final1)
print("\nValeurs finales (A[][0]) :\n", A0_final1)

print("Test du solveur Simplex 2")

a2 = np.array([
    [40   , 1   , 1   , 1   , 1, 0, 0],
    [63000, 1500, 1800, 1050, 0, 1, 0],
    [840  , 18  , 27  , 15  , 0, 0, 1]
], dtype=Fraction)

c2 = np.array([0, 420, 510, 360, 0, 0, 0], dtype=Fraction)

ci2 = np.array([
    [0, 4], # e1 (index 4)
    [0, 5], # e2 (index 5)
    [0, 6]  # e3 (index 6)
], dtype=Fraction)

Ci_final2, A0_final2 = simplex(a2, c2, ci2)

print("\nCi, i final :\n", Ci_final2)
print("\nValeurs finales (A[][0]) :\n", A0_final2)