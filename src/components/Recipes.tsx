import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import * as Yup from "yup";
import { RecipeItem, Material } from "../models/Interface";
import RecipeList from "./RecipeList";
import RecipeDetail from "./RecipeDetail";
import EditRecipe from './EditRecipe'
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
const initialValue:RecipeItem[] = [
  // {
  //   id: "adv32",
  //   name: "Hamburger",
  //   des: "Hamburger",
  //   imgUrl:
  //     "https://img.vn/uploads/thuvien/screen-shot-2021-11-26-at-14-44-04-png-20211126144425ScQHWX56fQ.png",
  //   materials: [
  //     { id: "Bread", quantity: 1 },
  //     { id: "Steak", quantity: 1 },
  //   ],
  // },
];
const Recipes: React.FC<{}> = () => {
  const location = useLocation() as any;
  const history = useHistory() as any;
  const [recipeList, setRecipes] = useState(initialValue as RecipeItem[]|[]);
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

              <Route exact path="/recipes/form">
                <div>
                  <Formik
                    initialValues={{
                      name: "",
                      imgUrl: "",
                      des: "",
                      materials: [
                        { id: "Bread", quantity: 1 },
                        { id: "Steak", quantity: 1 },
                      ],

                      //    masterial: ['jared', 'ian', 'brent']
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={(value) => {
                      const genId = () => {
                        return "a" + Math.floor(Math.random() * 1000);
                      };
                      let newReipes: RecipeItem[] = [
                        ...recipeList,
                        { id: genId(), ...value },
                      ];
                      localStorage.setItem(
                        "recipes",
                        JSON.stringify(newReipes)
                      );
                      setRecipes(newReipes);
                        removeDetail()
                      
                      history.push("/recipes");
                      // render lai cpn -> detail state update
                    }}
                  >
                    {(props: FormikProps<any>) => {
                      let validate = false;
                      let { name, imgUrl, des, materials } = props.values;
                      if (
                        JSON.stringify(props.errors) === "{}" &&
                        name &&
                        imgUrl &&
                        des &&
                        materials
                      )
                        validate = true;

                      return (
                        <FormikForm>
                          <ButtonGroup aria-label="Basic example">
                            <Button
                              type="submit"
                              disabled={validate ? false : true}
                              variant="success"
                            >
                              Save
                            </Button>
                            <NavLink to="/recipes">
                            <Button variant="danger">Cancel</Button>

                            </NavLink>
                          </ButtonGroup>
                          <br></br>
                          {console.log(props.errors)}

                          <Form.Group className="mb-3">
                            <Form.Label className="font-weight-bold">
                              First Name
                            </Form.Label>
                            <Field as={Form.Control} id="name" name="name" />
                            <ErrorMessage name="name" />
                          </Form.Group>
                          <Form.Group className="mb-3">
                            <Form.Label className="font-weight-bold">
                              Image URL
                            </Form.Label>
                            <Field
                              onKeyDown={() =>
                                handleShowImage(props.values.imgUrl)
                              }
                              as={Form.Control}
                              id="imgUrl"
                              name="imgUrl"
                            />
                            <ErrorMessage name="imgUrl" />
                          </Form.Group>
                          <img style={{ width: "50%" }} src={url} alt="" />
                          <Form.Group className="mb-3">
                            <Form.Label className="font-weight-bold">
                              Description
                            </Form.Label>
                            <Field
                              className="form-control"
                              as="textarea"
                              id="des"
                              name="des"
                            />
                            <ErrorMessage name="des" />
                          </Form.Group>

                          <FieldArray
                            name="materials"
                            render={(arrayHelpers: any) => (
                              <div>
                                {props.values.materials &&
                                props.values.materials.length > 0
                                  ? props.values.materials.map(
                                      (material: Material, index:string) => (
                                        <div key={index}>
                                          {/* key={material.id} error */}
                                          {console.log(props.values.materials)}
                                          <Row className="md-12">
                                            <Col md={9}>
                                              <Form.Group>
                                                <Field
                                                  as={Form.Control}
                                                  name={`materials.${index}.id`}
                                                />
                                                <ErrorMessage
                                                  name={`materials.${index}.id`}
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col md={2}>
                                              <Form.Group>
                                                <Field
                                                  type="number"
                                                  as={Form.Control}
                                                  name={`materials.${index}.quantity`}
                                                />
                                                <ErrorMessage
                                                  name={`materials.${index}.quantity`}
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col md={1}>
                                              <Form.Group>
                                                <Button
                                                  variant="danger"
                                                  type="button"
                                                  onClick={() => {
                                                    let index = findIndexById(
                                                      material.id,
                                                      props.values.materials
                                                    );
                                                    arrayHelpers.remove(index);
                                                  }} // remove a friend from the list
                                                >
                                                  X
                                                </Button>
                                              </Form.Group>
                                            </Col>
                                          </Row>
                                          <br></br>
                                        </div>
                                      )
                                    )
                                  : ""}
                                <br></br>
                                <Button
                                  variant="success"
                                  type="button"
                                  onClick={() =>
                                    arrayHelpers.insert(
                                      props.values.materials.length,
                                      ""
                                    )
                                  }
                                >
                                  Add Ingredient
                                </Button>
                              </div>
                            )}
                          />
                        </FormikForm>
                      );
                    }}
                  </Formik>
                  <br></br>
                </div>
              </Route>
              <Route exact path="/recipes/edit/:id">
                <EditRecipe setRecipeList={setRecipeList} recipes={recipeList} />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Recipes;
