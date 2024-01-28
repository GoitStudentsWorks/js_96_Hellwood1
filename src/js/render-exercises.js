import EnergyFlowApiSevice from './api-service';
import { categoriesCardsContainer } from './renderCategoriesByFilter';
import { showMessageBadRequest } from './showMessage';
import { resetPage, renderPageList } from './pagination';
import { page } from './pagination';
import { removePageList } from './pagination';
import { renderExerciseModal } from './renderExerciseModal';
const exerciseSearchInput = document.querySelector('.exercises-search-wrap');
let exerciseCategory;
let exerciseName;
let limit = window.innerWidth <= 1440 ? 8 : 9;

export let isSearchByKey = false;

export function renderExercises(e) {
  const ApiService = new EnergyFlowApiSevice();
  isSearchByKey = false;
  if (
    document.querySelector('.exercises-path-name').classList.contains('hidden')
  ) {
    if (e.target.nodeName !== 'LI') {
      return;
    }
    resetPage();
    exerciseCategory = renameFilter(e.target.dataset.filter);
    exerciseName = e.target.dataset.name;
  }

  try {
    return ApiService.getExercisesByCategory(
      exerciseCategory,
      exerciseName,
      page,
      limit
    ).then(r => {
      const cards = mapCards(r.results);
      renderPageList(r.totalPages, page);
      addExercisePath(capitalizeFirstLetter(exerciseName));
      addCardsToList(cards);
      shownExerciseSearchForm();
      categoriesCardsContainer.addEventListener('click', renderExerciseModal)
    });
  } catch {
    showMessageBadRequest();
  }
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function hideExerciseSearchForm() {
  const exerciseSearchInput = document.querySelector('.exercises-search-wrap');
  exerciseSearchInput.classList.add('hidden');
  resetForm();
}

function shownExerciseSearchForm() {
  const exerciseSearchInput = document.querySelector('.exercises-search-wrap');
  exerciseSearchInput.classList.remove('hidden');
  exerciseSearchInput.addEventListener('submit', initSearch);
  exerciseSearchInput.addEventListener('input', shownInputDeleteBtn);
}

export function renameFilter(filter) {
  if (filter === 'Body parts') {
    return (filter = 'bodypart');
  }
  return filter.toLowerCase();
}

function mapCards(data) {
  return data
    .map(
      item =>
        `<li class="exercises-card">
      <div class="exercises-card-upper-part">
        <div class="div-rating-or-delete-button">
          <div class="workout-text">WORKOUT</div>
          <div class="card-rating">${item.rating}<span>
            <svg class="rating-icon" width="18" height="18">
            <use href="../images/sprite.svg#icon-star"></use></svg>
          </span></div>
        </div>
        <button type="button" class="card-start open-modal-exercise" data-exercise-id="${item._id}">Start <span>
          <svg class="start-icon" width="14" height="14">
          <use href="../images/sprite.svg#icon-right-arrow"></use></svg>
        </span></button>
      </div>
      <div class="exercises-card-midle-part">
        <div class="exercises-card-midle-part-svg">
          <svg class="runing-man-icon" width="24" height="24">
          <use href="../images/sprite.svg#icon-runing-man"></use></svg>
        </div>
        <p class="card-exercise-name">${capitalizeFirstLetter(item.name)}</p>
      </div>
      <div class="exercises-card-lower-part">
        <p>Burned calories: <span class="exercises-card-lower-part-span">${item.burnedCalories} / 3 min</span></p>
        <p>Body part: <span class="exercises-card-lower-part-span">${item.bodyPart}</span></p>
        <p>Target: <span class="exercises-card-lower-part-span">${item.target}</span></p>
      </div>
    </li>`
    )
    .join('');
}

function addCardsToList(cards) {
  categoriesCardsContainer.innerHTML = cards;
}

function addExercisePath(pathName) {
  const titlePath = document.querySelector('.exercises-title');
  const namePath = document.querySelector('.exercises-path-name');

  titlePath.textContent = 'Exercises /';
  namePath.textContent = pathName;
  namePath.classList.remove('hidden');
}

function initSearch(e) {
  e.preventDefault();
  resetPage();
  searchExercises();
}

export function searchExercises() {
  isSearchByKey = true;

  const inputValue = exerciseSearchInput.firstElementChild.value;
  const ApiService = new EnergyFlowApiSevice();

  ApiService.getExercisesByKeyWord(
    exerciseCategory,
    exerciseName,
    inputValue,
    page,
    limit
  ).then(r => {
    if (r.results.length <= 0) {
      removePageList();
      const notFoundMessage =
        'Unfortunately, <span>no results</span> were found. You may want to consider other search options to find the exercise you are looking for. Our range is wide and you have the opportunity to find more options that suit your needs.';
      const onNotFound = `<li class="exercises-not-found-msg">${notFoundMessage}</li>`;
      return addCardsToList(onNotFound);
    }
    renderPageList(r.totalPages, page);
    const cards = mapCards(r.results);
    addCardsToList(cards);
  });
}

function shownInputDeleteBtn() {
  const inputValue = exerciseSearchInput.firstElementChild.value;
  const searchDeleteBtn = document.querySelector('.exercises-search-close-btn');
  if (inputValue) {
    searchDeleteBtn.classList.remove('hidden');
    searchDeleteBtn.addEventListener('click', resetForm);
  } else {
    hideInputDeleteBtn();
  }
}

function hideInputDeleteBtn() {
  const searchDeleteBtn = document.querySelector('.exercises-search-close-btn');
  searchDeleteBtn.classList.add('hidden');
  searchDeleteBtn.removeEventListener('click', resetForm);
}

function resetForm() {
  isSearchByKey = false;
  exerciseSearchInput.reset();
  hideInputDeleteBtn();
}
