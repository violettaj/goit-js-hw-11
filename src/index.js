import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formInput = document.querySelector("input");
const searchForm = document.querySelector("#search-form")
const gallery = document.querySelector(".gallery");
const load = document.querySelector(".load-more");
let page = 1;
searchForm.addEventListener("submit", handleSubmit);


function handleSubmit(e) {
  gallery.innerHTML = null;
  e.preventDefault();
  page = 1;
  const search = formInput.value

  if (search.length === 0) {
    Notify.failure("Please write something")
  } else {
    getImages(search)
  }}

async function getImages(input) {
    try {
      const response = await axios.get('https://pixabay.com/api/', {
        params: {
          key: "32238732-1ef990d163f563f21632dc5db",
          q: `${input}`,
          image_type: "photo",
          orientation: "horizontal",
          safesearch: true,
          page,
          per_page: 40,
        }
      });
  
      const totalHits = response.data.totalHits;
      checkResult(totalHits)
  
      const hits = response.data.hits
      renderImage(hits);
    } catch (error) {
      console.error(error);
    }
  };

  function checkResult(totalHits) {
  
    if (totalHits === 0) {
      Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }}

    function renderImage(hits) {
        const markup = hits.map((hit) => {
          const markupText = `<div class="photo-card">
          <a class="photo-card__link" href=${hit.largeImageURL}><img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" class="photo-card__img"/></a>
          <div class="info">
          <p class="info-item">
          <b>Likes</b> ${hit.likes}
          </p>
          <p class="info-item">
            <b>Views</b> ${hit.views}
          </p>
          <p class="info-item">
            <b>Comments</b> ${hit.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b> ${hit.downloads}
          </p>
        </div>
          </div>`
          return markupText;
        }).join("");
        gallery.insertAdjacentHTML("beforeend", markup)
        let lightbox = new SimpleLightbox(".gallery a")
        lightbox.refresh();
      }
      
     

      load.addEventListener('click', () => {
        page++;
        
      })
      


