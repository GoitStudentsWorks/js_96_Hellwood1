import EnergyFlowApiSevice from './api-service';
import { exerciseCardMarkup } from './markup';
import { showMessageBadRequest } from './showMessage';
import { initRating } from './giveRating';

export const renderExerciseModal = async e => {
  const exerciseModalBackdrop = document.querySelector('.exercise-modal');

  if (e.target.nodeName !== 'BUTTON') return;
  const request = new EnergyFlowApiSevice();
  const id = e.target.dataset.exerciseId;
  const modalExercise = document.querySelector('.exercise-modal');
  const modalBackdrop = document.querySelector('.exercise-modal-backdrop');
  try {
    const response = await request.getExerciseInfoById(id);
    exerciseModalBackdrop.innerHTML = exerciseCardMarkup(response);
    document.querySelector('.send-rating-form').dataset.id = id;
    openExerciseModal();
    
    const closeModealBtn = document.querySelector('.exercise-modal-close-btn');
    modalBackdrop.addEventListener('click', e => {
      if (e.target !== closeModealBtn && e.target !== modalBackdrop) {
        return;
      }
      closeExerciseModal();
    });
    closeModealBtn.addEventListener('click', closeExerciseModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeExerciseModal();
      }
    });
    initRating();
    const giveRatingButtons = document.querySelectorAll(
      '.exercise-rating-give-btn'
    );
    giveRatingButtons.forEach(button =>
      button.addEventListener('click', () => {
        const ratingBackdrop = document.querySelector(
          '[data-modal-rating-backdrop]'
        );
        const ratingContainer = document.querySelector(
          '[data-modal-rating-container]'
        );
        ratingBackdrop.classList.remove('backdrop-rating-is-hidden');
        ratingContainer.classList.remove('modal-rating-is-hidden');
        closeExerciseModal();
      })
    );
  } catch (error) {
    showMessageBadRequest();
  }

  function closeExerciseModal() {
    modalBackdrop.classList.add('backdrop-is-hidden');
    modalExercise.classList.add('modal-is-hidden');
  }
  function openExerciseModal() {
    modalBackdrop.classList.remove('backdrop-is-hidden');
    modalExercise.classList.remove('modal-is-hidden');
  }
};
