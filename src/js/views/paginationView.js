import View from './view';
import icons from 'url:../../img/icons.svg'; //* Parcel 2

class PaginationView extends View {
  addhandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      //   console.log(e);
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      console.log(goToPage);

      handler(goToPage);
    });
  }

  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultsPerPage,
    );

    //? page 1 and there are other pages

    if (currPage === 1 && numPages > 1) {
      return `
          <button data-goto ="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> -->`;
    }
    //? Last page

    if (currPage === numPages && numPages > 1) {
      return `
       <button data-goto ="${currPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
            </button>
          
      `;
    }
    //? Other page
    if (currPage < numPages) {
      return `
      <button data-goto ="${currPage - 1}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
            </button>


            
          <button data-goto ="${currPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> 
          
      `;
    }
    //? page 1 and there are NO other pages
    return '';
  }
}

export default new PaginationView();
