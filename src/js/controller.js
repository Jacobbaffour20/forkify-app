import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeview from './views/recipeview.js';
import SearchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import PaginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import paginationview from './views/paginationView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeview.renderSpinner();

    // (0) Update  results view to mark selected search result
    resultsView.update(model.getSearchResultPage());

    //? Uodating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    //? 1. Loading Recipe
    await model.loadRecipe(id);

    //? 2. Rendering Recipe.

    recipeview.render(model.state.recipe);
    // const recipeView = new recipeview(model.state.recipe);
  } catch (err) {
    recipeview.renderError();
    console.error(err);
  }
};

const controlSearchResult = async function () {
  try {
    resultsView.renderSpinner();
    //? Get Search Query
    const query = SearchView.getQuery();
    if (!query) return;

    //? load Search
    await model.loadSearchResult(query);

    //? render results
    // resultsView.render(model.state.search.result); //? All results
    resultsView.render(model.getSearchResultPage()); //? Only Part

    //? Render initial pagination buttons

    paginationview.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //? RENDER NEW  RESULTS
  resultsView.render(model.getSearchResultPage(goToPage)); //? Only Part

  //? Render NEW pagination buttons
  paginationview.render(model.state.search);

  console.log(goToPage);
};

const controlServings = function (newServings) {
  //? Update the recipe servings (in state)
  model.updateServings(newServings);

  //? Update the recipe view
  // recipeview.render(model.state.recipe);
  recipeview.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //* add or remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookamrk(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //? Update recipe view
  recipeview.update(model.state.recipe);

  //* Render bookmark
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //todo Show loading Spinner
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //? render recipe
    recipeview.render(model.state.recipe);

    //* Success Message
    addRecipeView.renderMessage();

    //? Render the Bookmark view
    bookmarksView.render(model.state.bookmarks);

    //? Change id u=in the URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();

    //? close form window
    setTimeout(() => {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
  //? upload recipe data
};

const newFeature = function () {
  console.log('Welcome to the Application.!');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeview.addHandlerRender(controlRecipes);
  recipeview.addHandlerUpdateServings(controlServings);
  recipeview.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResult);
  paginationview.addhandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};

init();

// controlRecipes();

// window.addEventListener('hashchange', controlRecipes);
// window.addEventListener('load', controlRecipes);
