import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, ButtonGroup } from "react-bootstrap";
import * as Yup from "yup";
import { Material } from "../models/Interface";
import RecipeList from "./RecipeList";
import RecipeDetail from "./RecipeDetail";

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
const validate: any = Yup.object().shape({
  id: Yup.string().required("Required"),
  quantity: Yup.number().min(1, "Minimum of 1 material").required("Required"),
});
const ShoppingList: React.FC<{}> = () => {
  const [materials, setMaterials] = useState([] as Material[]);
  const [showEdit, setShowEdit] = useState(false as boolean);
  // const [initForm, setInitForm] = useState({
  //   id: "",
  //   quantity: "",
  // } as Material);
  useEffect(() => {
    let materials: Material[] = [];
    if (window.localStorage.getItem("materials")) {
      materials = JSON.parse(
        window.localStorage.getItem("materials") as string
      );
    } else {
      window.localStorage.setItem("materials", JSON.stringify([]));
    }
    setMaterials(materials);
  }, []);
  // const fillForm = (material: Material): void => {
  //   console.log(material);
  //   setInitForm({ ...initForm, id: material.id, quantity: material.quantity });
  // };
  // console.log(initForm);
  const handleUpdate = (material: Material):void => {
    let newMaterials = materials.map(mate => {
      if(mate.id === material.id) {
        return {...mate, quantity: Number(material.quantity)}
      }
      return mate
    })
    setMaterials(newMaterials)
    window.localStorage.setItem("materials", JSON.stringify(newMaterials));

  }
  const handleDelete = (id:string):void => {
    let newMaterials = materials.filter(material => material.id !== id)
    setMaterials(newMaterials)
    window.localStorage.setItem("materials", JSON.stringify(newMaterials));
  }
  const initFormValues: Material = { id: "", quantity: 0 }
  return (
    <div className="mt-3 text-left">
      <Container>
        <Row>
          <Col sm={8}>
            <Formik
              initialValues={initFormValues}
              validationSchema={validate}
              // onReset={() => {}}
              onSubmit={(values: Material) => {
                let newMaterials: Material[] = [];
                newMaterials = [...materials, { ...values }];
                setMaterials(newMaterials);
                window.localStorage.setItem(
                  "materials",
                  JSON.stringify(newMaterials)
                );
              }}
            >
              {(props: FormikProps<any>) => {
                console.log(props);
                let validate = false;
                let { id, quantity } = props.values;
                if (JSON.stringify(props.errors) === "{}" && id && quantity)
                  validate = true;
                return (
                  <FormikForm>
                    <Row>
                      <Col md={9}>
                        <Form.Group>
                          <Form.Label>
                            <b>Name</b>
                          </Form.Label>
                          <Field
                            as={Form.Control}
                            id="id"
                            name="id"
                            value={props.values.id}
                          />
                          <ErrorMessage name="id" />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label>
                            <b>Amount</b>
                          </Form.Label>
                          <Field
                            as={Form.Control}
                            id="quantity"
                            name="quantity"
                            type="number"
                            value={props.values.quantity}
                          />
                          <ErrorMessage name="quantity" />
                        </Form.Group>
                      </Col>
                    </Row>
                    <br></br>
                    <Row>
                      <Col>
                        <Button
                          className={showEdit ? "d-none" : ""}
                          type="submit"
                          disabled={validate ? false : true}
                          variant="success"
                        >
                          Add
                        </Button>
                        <Button
                          className={showEdit ? "" : "d-none"}
                          variant="success"
                          onClick={() => handleUpdate(props.values)}
                        >
                          Update
                        </Button>
                        <Button
                          className={showEdit ? "" : "d-none"}
                          variant="danger"
                          onClick={() => {
                            props.setValues(initFormValues)
                            handleDelete(props.values.id)
                          }}

                        >
                          Delete
                        </Button>
                        {/* <Button type="reset" variant="primary">Clear</Button> */}
                        <Button onClick={() => props.setValues({...props.values, quantity: 0})} variant="primary">Clear</Button>

                      </Col>
                    </Row>
                    <br></br>
                    {materials.map((material) => (
                      <p
                        className="border p-2"
                        onClick={() => {
                          setShowEdit(true);
                          props.setValues(material);
                        }}
                      >
                        {material.id}- {material.quantity}
                      </p>
                    ))}
                  </FormikForm>
                );
              }}
            </Formik>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ShoppingList;
