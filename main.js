"use strict"

const form = document.querySelector(".form");
const banner = document.querySelector(".notification-banner");
const formFields = form.querySelectorAll("input, textarea");
const baseData = {};
let isFirstSubmit = true;

const validations = {
  firstName(value) {
    return !!value.trim();
  },
  lastName(value) {
    return !!value.trim();
  },
  email(value) {
    const isValidEmail = /[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$/;
    return isValidEmail.test(value);
  },
  about(value) {
    return !!value;
  },
  message(value) {
    return !!value.trim();
  },
  consent(value) {
    return !!value;
  },
}

copyAllkeys(baseData, formFields);

form.onsubmit = function(event) {
  event.preventDefault();

  const targetData = Object.fromEntries(new FormData(this));

  // after first submit and screen reder won't read out loud "required" repeatedly, which i think is annoying.
  removeRequiredAttributes(isFirstSubmit);

  updateAllValues(baseData, targetData);
  
  const isFormValid = validateForm(baseData, validations);

  moveFocusToFirstInvalid();

  if (isFormValid) displayBanner(banner);
}

// helper functions
function moveFocusToFirstInvalid() {
  const invalidInput = document.querySelector('[aria-invalid="true"]');
  invalidInput?.focus();
}

function displayBanner(banner) {
    setTimeout(() => {
      banner.classList.remove("hidden");
    }, 1000);
}

function validateForm(baseData, validations) {
  let isValid = true;

  for (let name in baseData) {
    if (isdataValid(name, baseData, validations)) { // valid logic here
      renderSuccess(name);
      
    } else { // invalid logic here
      renderInvalid(name);

      isValid = false;
    }
  }
  return isValid;
}

function renderInvalid(name) {
  const input = form.querySelector(`[name=${name}]`);
  input.setAttribute("data-error-state", "");
  input.setAttribute("aria-invalid", true)
  const value = input.getAttribute("aria-describedby");
  const errorDiv = document.getElementById(value);
  errorDiv.textContent = errorDiv.dataset.errorText;
}

function renderSuccess(name) {
  const input = form.querySelector(`[name=${name}]`);
  input.removeAttribute("data-error-state");
  input.removeAttribute("aria-invalid");
  const value = input.getAttribute("aria-describedby");
  const errorDiv = document.getElementById(value);
  errorDiv.textContent = "";
}

function isdataValid(name, baseData, validations) {
  return validations[name](baseData[name]);
}

function copyAllkeys(object, collection) {
  for (let field of collection) {
    object[field.name] = "";
  }
}

function updateAllValues(baseData, targetData) {
  for (let key in targetData) {
    baseData[key] = targetData[key];
  }
}

function removeRequiredAttributes(isFirstSubmit) {
  if (isFirstSubmit) {
    for (let input of formFields) {
      input.removeAttribute("required");
    }
  }
  isFirstSubmit = false;
}