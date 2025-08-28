// utils.js Added by DF - a new file to create a central getToken paramter used for multiple functions

/**
 * Extracts the 'token' parameter from the URL query string.
 * @returns {string|null} The token value or null if not present.
 */
function getToken() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
}
