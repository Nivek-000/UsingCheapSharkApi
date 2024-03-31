import * as db from './db.js';
import * as api from './api.js';
import inquirer from 'inquirer';

export const searchByKeyword = async (keyword) => {  //search api by keyword
    try {
        const searchResults = await api.searchByKeyword(keyword); 
        
        await db.create('search_history', { search: keyword, resultCount: searchResults.length }); //save history to search_history

        console.log('Search results:'); //used to display search results

        const { selectedItemIndex } = await inquirer.prompt({
            type: 'list',
            name: 'selectedItemIndex',
            message: 'Choose a game to view details:',
            choices: searchResults.map((result, index) => `${index + 1}. ${result.title}`),
        });

        const selectedIndex = parseInt(selectedItemIndex.split('.')[0]) - 1;
        const selectedItem = searchResults[selectedIndex];
        
        const { useCache } = await inquirer.prompt({
            type: 'confirm',
            name: 'useCache',
            message: 'Use cache?',
            default: false,
        });

        let detailedData;
        if (useCache) {
            detailedData = await db.find('search_cache', selectedItem.gameID); //finds the selected item in the cache
            if (!detailedData) {
                detailedData = await api.getDetailsById(selectedItem.gameID);
                await db.create('search_cache', { id: selectedItem.gameID, data: detailedData }); //if correct data isn't found, API gives selected item by ID
            }
        } else {
            detailedData = await api.getDetailsById(selectedItem.gameID); //get details
            await db.create('search_cache', { id: selectedItem.gameID, data: detailedData }); //saves as entry in search_cache
        }

        //display data
        console.log('Detailed data:');
        console.log(`Title: ${detailedData?.info.title}`);
        console.log(`Current Price: ${detailedData?.cheapestPriceEver.price}`);
        console.log(`Normal Price: ${detailedData?.deals[0]?.retailPrice}`);
        console.log(`Savings: ${detailedData?.deals[0]?.savings}`);
        
    } catch (error) {
        console.error('Error: No data found for the selected item.');
    }
};

//search history stuff
export const displaySearchHistory = async () => {
    try {
        const searchHistory = await db.find('search_history'); //retrieves search history from mock db
        
        console.log('Search history:'); //display history
        searchHistory.forEach((entry, index) => {
            console.log(`${index + 1}. Keyword: ${entry.search}, Result count: ${entry.resultCount}`);
        });
    } catch (error) { //try catch for base case
        console.error('Error:', error.message);
    }
};
