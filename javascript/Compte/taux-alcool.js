const alcoholTypeSelect = document.querySelector('.alcohol-type');
const alcoholAmountInput = document.querySelector('.alcohol-amount');
const bodyWeightInput = document.querySelector('.body-weight');
const genderSelect = document.querySelector('.gender');
const timeSinceDrinkingInput = document.querySelector('.time-since-drinking');
const resultOutput = document.querySelector('.result');
const calculateButton = document.querySelector('.calculate-button');

function calculateAlcoholLevel() {
    const selectedAlcoholType = alcoholTypeSelect.value;
    const alcoholAmount = parseFloat(alcoholAmountInput.value);
    const bodyWeight = parseFloat(bodyWeightInput.value);
    const gender = genderSelect.value;
    const timeSinceDrinking = parseFloat(timeSinceDrinkingInput.value);
    
    // Coefficients de conversion pour chaque type d'alcool (à adapter selon les besoins)
    const coefficients = {
        beer: 0.54,
        wine: 0.6,
        spirits: 0.4,
        cocktail: 0.2,
        whiskey: 0.4,
        vodka: 0.4,
        rum: 0.4,
        tequila: 0.4,
        gin: 0.4,
        liqueur: 0.25,
        jaeger: 0.35,
        shot: 0.4
    };

    // Coefficients de conversion pour le sexe de la personne (à adapter selon les besoins)
    const genderCoefficients = {
        male: 0.68,
        female: 0.55
    };
    
    // Calcul du taux d'alcool dans le sang en g/dL
    const alcoholConsumedGrams = alcoholAmount * coefficients[selectedAlcoholType] * 0.789;
    const alcoholLevel = (alcoholConsumedGrams / (bodyWeight * genderCoefficients[gender] * 10)) - (0.015 * timeSinceDrinking);
    
    // Formater le résultat en taux d'alcool par 100 ml de sang
    const formattedResult = alcoholLevel.toLocaleString('en-US', {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
    }) + ' g/100ml';
    
    resultOutput.textContent = formattedResult;
}

// Mettre à jour le calcul lorsque le bouton est cliqué
calculateButton.addEventListener('click', calculateAlcoholLevel);

// Calcul initial
calculateAlcoholLevel();

// Vérification et affichage initial
if (isNaN(parseFloat(resultOutput.textContent))) {
    resultOutput.textContent = '0.000 g/100ml';
}
