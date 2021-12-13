import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import * as Yup from "yup";
import { RecipeItem, Material } from "../models/Interface";
import RecipeList from "./RecipeList";
import RecipeDetail from "./RecipeDetail";
import AddRecipe from "./AddRecipe";
import EditRecipe from "./EditRecipe";
import {
  Formik,
  Field,
  Form as FormikForm,
  FormikProps,
  ErrorMessage,
  FieldArray,
} from "formik";
import { Form } from "react-bootstrap";
import styles from "./styles.module.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  useHistory,
  useLocation,
} from "react-router-dom";
const SignupSchema: any = Yup.object().shape({
  name: Yup.string().required("Name Required"),
  imgUrl: Yup.string().required("Image Required"),
  des: Yup.string().required("Des Required"),
  materials: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().required("Required"),
        quantity: Yup.number()
          .min(1, "Minimum of 1 material")
          .required("Required"),
      })
    )
    .required("Must have materials")
    .min(1, "Minimum of 1 materials"),
});
const initialValue: RecipeItem[] = [];
const Recipes: React.FC<{}> = () => {
  const location = useLocation() as any;
  const history = useHistory() as any;
  const [recipeList, setRecipes] = useState(initialValue as RecipeItem[] | []);
  const [recipeDetail, setRecipeDetail] = useState(null as RecipeItem | null);
  useEffect(() => {
    let recipes: RecipeItem[] = [];
    if (window.localStorage.getItem("recipes")) {
      recipes = JSON.parse(window.localStorage.getItem("recipes") as string);
    } else {
      recipes = initialValue;
      window.localStorage.setItem("recipes", JSON.stringify(recipes));
    }
    setRecipes(recipes);
  }, []);
  // edit -> recipes -> get lại dl
  const [url, setUrl] = useState("" as string);
  const handleShowImage = (value: string) => {
    setUrl(value);
    console.log(value, url);
  };
  const findIndexById = (id: string, arr: any): number => {
    let result = -1;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        result = i;
      }
    }
    return result;
  };
  const setDetail = (recipe: RecipeItem): void => {
    setRecipeDetail(recipe);
  };
  const setRecipeList = (recipes: RecipeItem[]): void => {
    setRecipes(recipes);
  };
  const removeDetail = (): void => {
    setRecipeDetail(null);
  };
  return (
    <div className="mt-3 text-left">
      <Container>
        <Row>
          <Col sm={5}>
            <NavLink
              className="text-light"
              activeClassName={styles.selected}
              to="/recipes/form"
            >
              <Button variant="success">New Recipe</Button>
              <hr></hr>
              <Route exact path="/recipes">
                <RecipeList setDetail={setDetail} recipeList={recipeList} />
              </Route>
            </NavLink>
          </Col>
          <Col sm={7}>
            <Switch>
              <Route exact path="/recipes">
                {recipeDetail ? (
                  <RecipeDetail
                    removeDetail={removeDetail}
                    setRecipeList={setRecipeList}
                    recipe={recipeDetail}
                  />
                ) : (
                  <h4>Please select a Recipe!</h4>
                )}
              </Route>

              <Route path="/recipes/form">
                <div>
                  <AddRecipe
                    recipeList={recipeList}
                    setRecipes={setRecipes}
                    removeDetail={removeDetail}
                  />

                  <br></br>
                </div>
              </Route>
              <Route path="/recipes/edit/:id">
                <EditRecipe
                  setRecipeList={setRecipeList}
                  recipes={recipeList}
                />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Recipes;
