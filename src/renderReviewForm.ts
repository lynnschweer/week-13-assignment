//UPDATING
import { reviewStarsSelect, reviewTextarea } from "./main"

export default function renderReviewForm(reviewData: {stars: number, text: string}) {
    reviewStarsSelect.value = reviewData.stars + ""
    reviewTextarea.value = reviewData.text
}
