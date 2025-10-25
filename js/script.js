// Use this URL to fetch NASA APOD JSON data.
const apodData = 'https://cdn.jsdelivr.net/gh/GCA-Classroom/apod/data.json';

// Function to fetch data from the API
async function fetchApodData() {
    try {
        // Fetch data from the URL
        const response = await fetch(apodData);
        
        // Convert the response to JSON format
        const data = await response.json();
        
        // Log the data to see what we got
        console.log('NASA APOD Data:', data);
        
        // Return the data so we can use it later
        return data;
    } catch (error) {
        // If something goes wrong, log the error
        console.error('Error fetching data:', error);
    }
}

// Function to create a gallery of space images
function createGallery(data) {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing content

    data.forEach(item => {
        // Create a container for each image
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        // Create an image element
        const img = document.createElement('img');
        // Check if the media type is video and use the thumbnail
        if (item.media_type === 'video') {
            img.src = item.thumbnail_url || 'https://via.placeholder.com/300x200?text=No+Thumbnail';
            img.alt = 'Video Thumbnail';
        } else {
            img.src = item.url;
            img.alt = item.title;
        }

        // Create a title element
        const title = document.createElement('h3');
        title.textContent = item.title;

        // Create a date element
        const date = document.createElement('p');
        date.textContent = `Date: ${item.date}`;

        // Create a button element for viewing details
        const viewDetailsBtn = document.createElement('button');
        viewDetailsBtn.textContent = 'View Details';
        viewDetailsBtn.classList.add('view-details-btn');

        // Add click event to open modal
        viewDetailsBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering other click events
            openModal(item);
        });

        // Append elements to the container
        imageContainer.appendChild(img);
        imageContainer.appendChild(title);
        imageContainer.appendChild(date);
        imageContainer.appendChild(viewDetailsBtn);

        // Add click event to open modal
        imageContainer.addEventListener('click', () => openModal(item));

        // Append the container to the gallery
        gallery.appendChild(imageContainer);
    });
}

// Function to open the modal with image details
function openModal(item) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalExplanation = document.getElementById('modalExplanation');

    // Set modal content
    modalImage.style.display = 'none'; // Hide the image element

    // Create or update a video element
    let modalVideo = document.getElementById('modalVideo');
    if (!modalVideo) {
        modalVideo = document.createElement('iframe');
        modalVideo.id = 'modalVideo';
        modalVideo.width = '100%';
        modalVideo.height = '315';
        modalVideo.style.border = 'none';
        modalVideo.allowFullscreen = true;
        modalImage.parentNode.insertBefore(modalVideo, modalImage.nextSibling);
    }
    modalVideo.src = item.url;
    modalVideo.style.display = 'block';

    modalTitle.textContent = item.title;
    modalDate.textContent = `Date: ${item.date}`;
    modalExplanation.textContent = item.explanation;

    // Show the modal
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('imageModal');
    modal.style.display = 'none';
}

// Add event listener to close button
const closeButton = document.querySelector('.close-button');
closeButton.addEventListener('click', closeModal);

// Add event listener to close modal when clicking outside of it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('imageModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Function to show a loading message
function showLoadingMessage() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = '<p class="loading-message">🔄 Loading images, please wait...</p>';
}

// Call the function to fetch the data
fetchApodData();

// Add event listener to the button
const getImageBtn = document.getElementById('getImageBtn');
getImageBtn.addEventListener('click', async () => {
    // Show loading message before fetching data
    showLoadingMessage();
    const data = await fetchApodData(); // Fetch data from the API
    if (data) {
        createGallery(data); // Generate the gallery
    }
});