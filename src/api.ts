

type Review = {
    id: number
    author: string
    text: string
    stars: number
    movieId: number
  };

//FETCHING
export async function fetchAllReviews() {
    const response = await fetch("http://localhost:3000/reviews");
    return response.json();
}

export async function postReview(newReviewData: {
  author: string, 
  text: string, 
  stars: number, 
  movieId: number}
) 
{
    const response = await fetch("http://localhost:3000/reviews/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newReviewData)
    });
    return response.json();
}

export async function putReview(updatedReview: Review) {
    await fetch("http://localhost:3000/reviews/" + updatedReview.id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedReview)
    });
}

export async function deleteReview(idToDelete: number) {
    await fetch("http://localhost:3000/reviews/" + idToDelete, { method: "DELETE" });
}