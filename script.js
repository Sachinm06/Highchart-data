let data;

fetch('data.json')
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData;
    populateDropdowns();
  })
  .catch(error => console.error('Error fetching data:', error));

function populateDropdowns() {
  const countrySelect = document.getElementById('countrySelect');
  const citySelect = document.getElementById('citySelect');
  data.countries.forEach(country => {
    const option = document.createElement('option');
    option.value = country.name;
    option.textContent = country.name;
    countrySelect.appendChild(option);
  });
  changeCities();
}

function changeCities() {
  const countrySelect = document.getElementById('countrySelect');
  const citySelect = document.getElementById('citySelect');
  const selectedCountry = countrySelect.value;
  const selectedCountryData = data.countries.find(country => country.name === selectedCountry);
  const cities = selectedCountryData ? selectedCountryData.cities : [];
  citySelect.innerHTML = '';
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city.name;
    option.textContent = city.name;
    citySelect.appendChild(option);
  });
  showOptions();
}

function showOptions() {
  const optionsDiv = document.getElementById('optionsDiv');
  const citySelect = document.getElementById('citySelect');
  const selectedCity = citySelect.value;
  const selectedCountry = document.getElementById('countrySelect').value;
  const selectedCountryData = data.countries.find(country => country.name === selectedCountry);
  const selectedCityData = selectedCountryData ? selectedCountryData.cities.find(city => city.name === selectedCity) : null;
  const optionsList = document.getElementById('optionsList');
  console.log("selected option", optionsList);

  if (selectedCityData) {
    optionsList.innerHTML = '';
    selectedCityData.options.forEach((option, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = option.name;
      listItem.addEventListener('click', () => {
        showOptionData(option);
        toggleClicked(listItem);
      });
      optionsList.appendChild(listItem);
      if (index === 0) {
        showOptionData(option);
      }
    });
    optionsDiv.style.display = 'block';
  } else {
    optionsDiv.style.display = 'none';
  }

  const firstListItem = optionsList.querySelector('li');
  if (firstListItem) {
    toggleClicked(firstListItem);
  }
}

function toggleClicked(listItem) {
  const optionsList = document.getElementById('optionsList');

  optionsList.querySelectorAll('li').forEach(item => {
    item.classList.remove('clicked');

  });

  listItem.classList.toggle('clicked');
}

function showOptionData(option) {
const optionDataDiv = document.getElementById('optionData');
optionDataDiv.innerHTML = ''; 

if (option.data && option.data.chart && option.data.chart.type === 'line' && option.data.series) {
Highcharts.chart('optionData', {
  chart: {
    type: 'line'
  },
  title: {
    text: option.data.title.text
  },
  xAxis: {
    categories: option.data.xAxis.categories
  },
  yAxis: {
    title: {
      text: option.data.yAxis.title.text
    }
  },
  series: option.data.series
});
} else if (option.data && option.data.years && option.data.years['2020']) {
const table = document.createElement('table');
table.classList.add('data-table');
table.style.borderCollapse = 'collapse'; 

const thead = document.createElement('thead');
const headerRow = document.createElement('tr');
const headers = Object.keys(option.data.years['2020']); 
headers.forEach(headerText => {
  const th = document.createElement('th');
  th.textContent = headerText;
  th.style.border = '1px solid #dddddd'; 
  th.style.padding = '8px'; 
  headerRow.appendChild(th);
});
thead.appendChild(headerRow);
table.appendChild(thead);

const tbody = document.createElement('tbody');
headers.forEach(indicator => {
  const indicatorRow = document.createElement('tr');

  const indicatorCell = document.createElement('td');
  indicatorCell.textContent = indicator;
  indicatorCell.style.border = '1px solid #dddddd'; 
  indicatorCell.style.padding = '8px'; 
  indicatorRow.appendChild(indicatorCell);

  ['2020', '2030', 'Change #', 'Change %'].forEach(year => {
    const cell = document.createElement('td');
    cell.textContent = option.data.years[year][indicator];
    cell.style.border = '1px solid #dddddd'; 
    cell.style.padding = '8px'; 
    indicatorRow.appendChild(cell);
  });

  tbody.appendChild(indicatorRow);
});

table.appendChild(tbody);

optionDataDiv.appendChild(table);
} else {
optionDataDiv.textContent = 'Error: Data is not available or has an unexpected structure.';
}

if (option.name === 'Population Pyramid for 2020') {
generatePopulationPyramid(option.data);
} else {
document.getElementById('chart-container').innerHTML = '';
}
}


//Population Pyramid for 2020

function generatePopulationPyramid(data) {
if (data && data.Male && data.Female) {
Highcharts.chart('optionData', {
  chart: {
    type: 'bar',
    layout: 'vertical',
  },
  title: {
    text: 'Population Pyramid for 2020'
  },
  xAxis: [{
    categories: ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100 +'],
    reversed: false,
    labels: {
      step: 1
    }
  }, { 
    opposite: true,
    reversed: false,
    categories: ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80-84', '85-89', '90-94', '95-99', '100 +'],
    linkedTo: 0,
    labels: {
      step: 1
    }
  }],
  yAxis: {
    title: {
      text: null
    },
    labels: {
      formatter: function () {
        return Math.abs(this.value);
      }
    }
  },
  plotOptions: {
    series: {
      stacking: 'normal'
    }
  },
  tooltip: {
    formatter: function () {
      return '<b>' + this.series.name + ', age ' + this.point.category + '</b><br/>' +
        'Population: ' + Highcharts.numberFormat(Math.abs(this.point.y), 0);
    }
  },
  series: [{
    name: 'Male',
    data: data.Male.map(value => -value) 
  }, {
    name: 'Female',
    data: data.Female
  }],
  legend: {
    align: 'center',
    verticalAlign: 'bottom',
    layout: 'horizontal',
    x: 0,
    y: 0
  },
  credits: {
    enabled: false
  }
});
} else {
document.getElementById('optionData').innerHTML = 'data is not available.';
}
}