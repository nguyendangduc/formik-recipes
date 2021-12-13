import React, { useState, useEffect } from "react";
import { RecipeItem, Material } from "../models/Interface";
import RecipeList from "./RecipeList";
import { useParams } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { NavLink, useHistory } from "react-router-dom";
interface Props {
    recipe: RecipeItem;
    setRecipeList: (recipes: RecipeItem[]) =>void
    removeDetail: () => void
}
const findIndexById = (id: string, arr: any): number => {
  let result = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      console.log(id, arr[i].id);
      result = i;
    }
  }
  return result;
};

const RecipeDetail: React.FC<Props> = (props) => {
  const history = useHistory() as any;
  const {recipe} = props

  const handleAdd = () => {
    let materials: Material[] = [];
    if (window.localStorage.getItem("materials")) {
      materials = JSON.parse(
        window.localStorage.getItem("materials") as string
      );
    } // exist -> get/ not exist -> init let -> set
    materials = [...materials, ...recipe.materials]
    let newMaterials: Material[] = []
    materials.forEach((material) => {
      let index = findIndexById(material.id, newMaterials);
      if (index > -1) {
        newMaterials[index].quantity += material.quantity;
      } else {
        newMaterials.push(material);
      }
    });
    window.localStorage.setItem("materials", JSON.stringify(newMaterials));
  };
  const handleDelete = (event: any, recipe: RecipeItem) => {
    event.preventDefault();

    let newReipes: RecipeItem[] = [];
    if (window.localStorage.getItem("recipes")) {
      newReipes = JSON.parse(window.localStorage.getItem("recipes") as string);
    }
    let index = findIndexById(recipe.id, newReipes);
    if (index > -1) {
      newReipes = [...newReipes.slice(0, index), ...newReipes.slice(index + 1)];
    }

    localStorage.setItem("recipes", JSON.stringify(newReipes));
    props.removeDetail()
    props.setRecipeList(newReipes)
    history.push("/recipes");
  };
  return (
    <div>
      {recipe ? (
        <div>
          <img style={{ width: "40%" }} src={recipe.imgUrl} alt="" />
          <h2>{recipe.name}</h2>
          <Dropdown>
            <Dropdown.Toggle variant="primary" id="dropdown-basic">
              Dropdown Button
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item>
                <NavLink onClick={() => handleAdd()} to={`/shopping-list`}>
                  To Shopping list
                </NavLink>
              </Dropdown.Item>
              <Dropdown.Item>
                <NavLink to={`/recipes/edit/${recipe.id}`}>Edit Recipe</NavLink>
              </Dropdown.Item>
              <Dropdown.Item>
                <NavLink
                  onClick={(event: any) => handleDelete(event, recipe)}
                  to={`/shopping-list/delete`}
                >
                  Delete Recipe
                </NavLink>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <p>{recipe.des}</p>
          {recipe.materials?.map((material) => (
            <p className="border p-2">
              {material.id}- {material.quantity}
            </p>
          ))}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default RecipeDetail;
