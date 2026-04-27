from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Dict, List, Literal
import sys
import os

# Add parent directory to path to import simplex_solve
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from simplex_solve import solve_simplex

app = FastAPI(
    title="Simplex Finance API",
    description="API pour résoudre des problèmes d'optimisation linéaire par la méthode du simplexe",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for validation
class ConstraintCoefficient(BaseModel):
    """Coefficients for a single constraint"""
    x1: float = 0.0
    x2: float = 0.0
    x3: float = 0.0
    x4: float = 0.0
    x5: float = 0.0
    x6: float = 0.0
    x7: float = 0.0
    x8: float = 0.0
    x9: float = 0.0
    x10: float = 0.0

class Constraint(BaseModel):
    """A single constraint"""
    coeffs: Dict[str, float] = Field(default_factory=dict, description="Coefficients for each variable")
    type: Literal["<=", ">=", "="] = Field(..., description="Type of constraint")
    b: float = Field(..., gt=0, description="Right-hand side value (must be positive)")

    @field_validator('coeffs')
    @classmethod
    def validate_coeffs(cls, v):
        if not v:
            raise ValueError("At least one coefficient must be specified")
        # Ensure all keys start with 'x' followed by a number
        for key in v.keys():
            if not key.startswith('x') or not key[1:].isdigit():
                raise ValueError(f"Invalid variable name: {key}. Must be x1, x2, etc.")
        return v

class SimplexRequest(BaseModel):
    """Request model for simplex solver"""
    objective_type: Literal["max", "min"] = Field(..., description="Type of optimization: maximize or minimize")
    num_variables: int = Field(..., ge=1, le=10, description="Number of decision variables (1-10)")
    objective_coefficients: List[float] = Field(..., min_items=1, description="Objective function coefficients")
    constraints: List[Constraint] = Field(..., min_items=1, description="List of constraints")

    @model_validator(mode='after')
    def validate_objective_coefficients(self):
        if len(self.objective_coefficients) != self.num_variables:
            raise ValueError(f"Number of coefficients ({len(self.objective_coefficients)}) must match num_variables ({self.num_variables})")
        return self

class SimplexResponse(BaseModel):
    """Response model for simplex solver"""
    variables: Dict[str, float] = Field(description="Optimal values for decision variables")
    z: float = Field(description="Optimal value of the objective function")
    success: bool = Field(description="Whether the solution was found")
    message: str = Field(description="Additional information about the solution")

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Simplex Finance API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}

@app.post("/solve", response_model=SimplexResponse)
async def solve(request: SimplexRequest):
    """
    Solve a linear programming problem using the simplex method
    
    Args:
        request: SimplexRequest with objective_type, num_variables, objective_coefficients, and constraints
    
    Returns:
        SimplexResponse with optimal variable values and objective function value
    """
    try:
        # Transform frontend format to simplex_solve format
        objectives = {}
        for i, coeff in enumerate(request.objective_coefficients):
            objectives[f'x{i+1}'] = coeff
        
        # Transform constraints
        constraints_list = []
        for constraint in request.constraints:
            # Ensure coeffs dict has the right format
            coeffs_dict = {}
            for var_name, value in constraint.coeffs.items():
                coeffs_dict[var_name] = value
            
            constraints_list.append({
                'coeffs': coeffs_dict,
                'type': constraint.type,
                'b': constraint.b
            })
        
        # Call the simplex solver
        mode = 'MAX' if request.objective_type == 'max' else 'MIN'
        result = solve_simplex(objectives, constraints_list, mode=mode)
        
        # Extract z value
        z_value = result.pop('z')
        
        # Filter out slack variables (only return decision variables)
        decision_vars = {}
        for i in range(request.num_variables):
            var_name = f'x{i+1}'
            decision_vars[var_name] = result.get(var_name, 0.0)
        
        return SimplexResponse(
            variables=decision_vars,
            z=z_value,
            success=True,
            message="Solution found successfully"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
