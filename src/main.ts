import "bootstrap/dist/css/bootstrap.min.css"
import { deleteReview, putReview, postReview, fetchAllReviews } from "./api"
import renderReviewForm from "./renderReviewForm"

export type Review = {
  id: number
  author: string
  text: string
  stars: number
  movieId: number
}


//STATE
let reviewList: { id: number; author: string; movieId: number; text: string; stars: number }[] = []
let reviewToEditId: null | number = null // Set to null initially
let user = "Lynn"
let movieId = 3

//rendering and listening
const reviewsContainer = document.getElementById("reviews-container") as HTMLDivElement
export const reviewStarsSelect = document.getElementById("review-stars-select") as HTMLSelectElement
export const reviewTextarea = document.getElementById("review-textarea") as HTMLTextAreaElement

document.getElementById("save-button")!.addEventListener("click", onSaveReviewClick)
//render a list of reviews
function renderReviewList() {
    reviewsContainer.innerHTML = ""
    if (reviewList.length === 0) {
        reviewsContainer.innerHTML = "No reviews yet"
    }
    reviewList.map(renderReview).forEach(div => reviewsContainer.appendChild(div))
}

//render one review
function renderReview(review: Review) {
  const reviewDiv = document.createElement("div")
  reviewDiv.className = "bg-light mb-3 pt-4"
  reviewDiv.innerHTML = `
      <h5>${review.author}</h5>
      <p>${Array(review.stars).fill(null).map(_ => "!").join("")}</p>
      <p>${review.text}</p>
      <button class="edit-button btn btn-sm btn-outline-primary">Edit</button>
      <button class="delete-button btn btn-sm btn-outline-danger">Delete</button>
  `;

  reviewDiv.querySelector(".edit-button")!.addEventListener("click", () => {
      reviewToEditId = review.id
      renderReviewForm(review)
  });

  reviewDiv.querySelector(".delete-button")!.addEventListener("click", async () => {
      await deleteReview(review.id);
      const indexToDelete = reviewList.indexOf(review);
      reviewList.splice(indexToDelete, 1);
      renderReviewList();
  });

  return reviewDiv;
}

//Save button click handling
async function onSaveReviewClick(event: Event) {
    event.preventDefault(); // Prevent default form submission behavior

    const reviewData = {
        author: user,
        movieId: movieId,
        text: reviewTextarea.value,
        stars: parseInt(reviewStarsSelect.value)
    };

    // Check if the review is for editing or a new one
    if (reviewToEditId !== null) {
      const reviewToUpdate = {
        ...reviewData,
        id: reviewToEditId
      }
        await putReview(reviewToUpdate); // Update existing review
        
        const indexToReplace = reviewList.findIndex(r => r.id === reviewToEditId);
        reviewList[indexToReplace] = reviewToUpdate // Update review in list
    } else {
        const createdReview = await postReview(reviewData); // Create a new review
        reviewList.push(createdReview); // Add the new review to the list
    }

    renderReviewList(); // Re-render the reviews
    reviewToEditId = null; // Reset the edit ID
    renderReviewForm({ stars: 1, text: "" }); // Clear the form
}

//START UP
async function startUp() {
    reviewList = await fetchAllReviews();
    console.log("Reviews fetched:", reviewList);
    renderReviewList();
}
startUp();

