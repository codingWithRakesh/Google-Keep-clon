import { API_URL } from "../constant/constants";

const fetchBinNotes = async (setBinNote) => {
    try {
        const response = await fetch(`${API_URL}/binnote`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch notes');
        }

        const data = await response.json();
        // console.log('Fetched data: ', data.data[0].allNotes);
        setBinNote(data.data[0].allNotes);
    } catch (error) {
        // console.error('Error fetching notes:', error.message);
        throw error
    }
};

export default fetchBinNotes