js/**
 * Review parsing is largely DOM-structure dependent. This parser targets
 * common patterns on Clutch-like review layouts but is resilient to change.
 */

function parseRating(el, $) {
  const ratingText =
    $(el).find('[itemprop="ratingValue"]').first().text().trim() ||
    $(el).find('.rating span').first().text().trim() ||
    $(el).find('.rating').first().text().trim();
  if (!ratingText) return null;

  const match = ratingText.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

function parseReviewer(el, $) {
  const name =
    $(el).find('.reviewer-name, [itemprop="author"] .name').first().text().trim() ||
    $(el).find('.reviewer').first().text().trim() ||
    null;

  const title =
    $(el).find('.reviewer-title').first().text().trim() ||
    $(el).find('.reviewer-position').first().text().trim() ||
    null;

  return { name, title };
}

function parseReviewBody(el, $) {
  const comments =
    $(el).find('.review-body, .review-description, [itemprop="reviewBody"]').first().text().trim() ||
    null;

  return { comments };
}

function parseReviewHeader(el, $) {
  const name =
    $(el).find('.review-title, h3, h4').first().text().trim() ||
    null;

  const datePublishedText =
    $(el).find('time[itemprop="datePublished"]').first().attr('datetime') ||
    $(el).find('time[itemprop="datePublished"]').first().text().trim() ||
    $(el).find('.review-date').first().text().trim() ||
    null;

  const datePublished = datePublishedText || null;

  return { name, datePublished };
}

/**
 * Parse reviews from a cheerio instance of the full profile page.
 */
function parseReviews($) {
  const reviews = [];

  const reviewContainers = $('.review, .review-card, [itemprop="review"]');
  reviewContainers.each((_, el) => {
    const header = parseReviewHeader(el, $);
    const rating = parseRating(el, $);
    const review = parseReviewBody(el, $);
    const reviewer = parseReviewer(el, $);

    // Do not include completely empty reviews.
    if (!header.name && !review.comments && rating == null) {
      return;
    }

    reviews.push({
      name: header.name,
      datePublished: header.datePublished,
      review: {
        rating,
        comments: review.comments,
      },
      reviewer,
    });
  });

  return reviews;
}

module.exports = {
  parseReviews,
};