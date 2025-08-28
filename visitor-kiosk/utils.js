// utils.js Added by DF - a new file to create a central getToken paramter used for multiple functions

// const deliveryToken = "OTA4MDRhNjItMzQ3Yy00ZGIzLWEyNTYtODg1N2RjYmIyNjU1N2RlOTM3ODUtOTRk_PF84_895155b7-cc7a-426c-bb66-768bd3be1b8e"

/**
 * Extracts the 'token' parameter from the URL query string.
 * @returns {string|null} The token value or null if not present.
 */
function getToken() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('token');
}
