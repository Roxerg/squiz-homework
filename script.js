
    // JSON data
    let companies = [];
    // JSON data after filtering 
    let filteredCompanies = null;

    let _table = document.getElementById('data-table');
    let valueRows = [];
    let labelRow = null;

    let filters = {};

    const countryFilterInput = document.getElementById('countryFilter');
    countryFilterInput.addEventListener('input', generateFilterFunction('country'));
    countryFilterInput.addEventListener('propertychange', generateFilterFunction('country')); // for IE8

    const industryFilterInput = document.getElementById('industryFilter');
    industryFilterInput.addEventListener('input', generateFilterFunction('industry'));
    industryFilterInput.addEventListener('propertychange', generateFilterFunction('industry')); // for IE8

    const sortOrderButton = document.getElementById('sortOrder');
    let sortField = 'id';
    let sortAsc = true;

    document.getElementById('sortBy').onchange = onSortByChange;
    sortOrderButton.onclick = onSortOrderToggle;

    function onSortOrderToggle () {
        sortAsc = !sortAsc;
        if (sortAsc) {
            sortOrderButton.textContent = 'Asc';
        } else {
            sortOrderButton.textContent = 'Desc';
        }
        updateTable();
    }

    function onSortByChange (event) {
        sortField = event.target.value;
        updateTable();
    }

    function updateTable() {
        const sortedResult = sortResults(filterResults());
        emptyTable();
        addValueRows(sortedResult);
    }

    function emptyTable() {
        if (valueRows) {
            valueRows.forEach((e) => _table.removeChild(e));
            valueRows = null;
        }
    }

    function sortResults (entries) {
        return entries.sort((c1,c2) => {
            const a = c1[sortField];
            const b = c2[sortField];
            if (a > b) {
                return sortAsc ? 1 : -1;
            } else if (a < b) {
                return sortAsc ? -1 : 1;
            }
            return 0;
        })
    }

    function filterResults() {
        return companies.filter((company) => {
            return Object.entries(filters).reduce((prev, [filterField,filterExp]) => {
                return prev && (filterExp ? filterExp.test(company[filterField]) : true);
            }, true)
        });
    }

    function generateFilterFunction(field) {
        return (event) => {
            filters[field] = event.target.value ? new RegExp(`(^|\\s)${event.target.value}`, 'i') : null;
            updateTable();
        }
    }


    function generateLabels(entries) {
        const labelRow = document.createElement('tr');
        Object.keys(entries[0]).forEach((key) => {
            const columnVal = document.createElement('th');
            columnVal.textContent = key;
            labelRow.appendChild(columnVal);
        })
        return labelRow;
    }

    function generateValues(entries) {
        valueRows = entries.map((entry) => {
            const entryRow = document.createElement('tr');
            Object.values(entry).forEach((value) => {
                const columnVal = document.createElement('td');
                columnVal.textContent = value
                entryRow.appendChild(columnVal)       
            })
            return entryRow;
        })
        return valueRows;
    }

    function addLabelRow(entries) {
        _table.appendChild(generateLabels(entries));
    }

    function addValueRows(entries) {

        if (entries.length === 0) {
            const nothingFound = document.createElement('tr');
            nothingFound.id = 'nothing-found';
            nothingFound.textContent = 'Nothing found :(. Try changing the filters.';
            _table.appendChild(nothingFound);
            valueRows = [nothingFound];
            return;
        }

        const values = generateValues(entries);
        valueRows = values;
        values.forEach((row) => {
            _table.appendChild(row);
        });
    }

    

    function fetchData() { 
        fetch('https://dujour.squiz.cloud/developer-challenge/data')
        .then((response) => response.json())
        .then((data) => {
            companies = data;
        }).then(() => {
            addLabelRow(companies);
            addValueRows(companies);
        }).catch((err) => {
            alert('Failed to fetch table data:', err);
        })
    }

    fetchData();

    window.onload = function() {
        document.getElementById('sortBy').value = 'id';
        countryFilterInput.value = '';
        industryFilterInput.value = '';
    }
    