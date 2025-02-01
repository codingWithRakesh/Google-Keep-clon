import {API_URL} from '../constant/constants.js'

const fetchMainContainerNotes = async (setValueMain) => {
    try {
        const response = await fetch(`${API_URL}/notes`, {
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
        console.log('Fetched data: ', data.data[0].allNotes);
        setValueMain(data.data[0].allNotes);
    } catch (error) {
        console.error('Error fetching notes:', error.message);
    }
};

export default fetchMainContainerNotes