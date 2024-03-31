import axios from 'axios';

const base = 'https://www.cheapshark.com/api/1.0/';

// Function for searching deals by title
export const searchByKeyword = async(keyword) => {
    // Your search API endpoint
    const url = `https://www.cheapshark.com/api/1.0/deals?title=${encodeURIComponent(keyword)}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error('Error searching for games:', error);
    }
}

export const getDetailsById = async(id) => {
    // Your get details API endpoint
    const url = `https://www.cheapshark.com/api/1.0/deals?id=${id}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error getting game details:', error);
        return null;
    }
}