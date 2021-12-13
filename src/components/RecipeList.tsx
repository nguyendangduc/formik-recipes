import React from 'react';
import styles from './styles.module.css'
import {RecipeItem} from '../models/Interface'
interface Props {
    recipeList: RecipeItem[],
    setDetail: (recipe: RecipeItem) =>void
}
import {
    BrowserRouter as Router,
    NavLink,
    useHistory
  } from "react-router-dom";
const RecipeList = (props: Props) => {
    const history = useHistory() as any;
    const {recipeList} = props
    console.log(recipeList)
    const handleSetDetail = (recipe: RecipeItem) => {
        props.setDetail(recipe)
        // history.push('/recipfes')
    }
    return (
        <div>
           { recipeList.map((recipe:RecipeItem) =>(
               <NavLink to="#"  onClick={() => {handleSetDetail(recipe)}}>
               <div className= { 'p-2 border ' + styles.recipeItem}>
                   <div className="d-flex justify-content-between">
                       <div>
                           <p className=" m-2"><b>{recipe.name}</b></p>
                           <p className=" m-2">{recipe.des}</p>

                       </div>
                       <img className="m-2" style={{width: '70px'}} src={recipe.imgUrl}></img>
                   </div>
               </div>
               </NavLink>
           )) }
        </div>
    );
};

export default RecipeList;