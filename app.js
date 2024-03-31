import * as db from './db.js';
import * as api from './api.js';

export const searchKeyword = async (keyword) => {  //search api by keyword
    try {
        const searchResults = await searchByKeyword(keyword); 
        
        await db.create('search_history', { search: keyword, resultCount: searchResults.length }); //save history to search_history

        console.log('Search results:'); //used to display search results
        searchResults.forEach((result, index) => {
            console.log(`${index + 1}. ${result.title}`); //index increasing for each game/details returned
        });

        const selectedItemIndex = parseInt(prompt('Enter the number of the item you want to view: ')) - 1;
        const selectedItem = searchResults[selectedItemIndex]; //prompts user to select an item from the search results

       
        const cacheOption = prompt('Use cache? (y/n): '); //asks if they want to use cache
        let detailedData;
        if (cacheOption === 'y') {
            detailedData = await db.find('search_cache', selectedItem.id); //finds the selected item in the cache
            if (!detailedData) {
                detailedData = await getDetailsById(selectedItem.id);
                await db.create('search_cache', { id: selectedItem.id, data: detailedData }); //if correct data isnt found, API gives selected item by ID
            }
        } else {
            detailedData = await getDetailsById(selectedItem.id); //get details
            await db.create('search_cache', { id: selectedItem.id, data: detailedData }); //saves as entry in search_cache
        }

        //display data
        console.log('Detailed data:');
        console.log(`Title: ${detailedData.title}`);
        console.log(`Price: ${detailedData.price}`);
        console.log(`Publisher: ${detailedData.publisher}`);
        
    } catch (error) {
        console.error('Error:', error.message);
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