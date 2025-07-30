const courses = [
    { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, certificate: 'Web and Computer Programming', description: 'Learn the basics of programming concepts and logical thinking using Python.', technology: ['Python'], completed: true },
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: 'Explore the foundational languages of the web: HTML for structure and CSS for styling.', technology: ['HTML', 'CSS'], completed: true },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, certificate: 'Web and Computer Programming', description: 'Build upon basic programming by learning to write modular and reusable functions.', technology: ['Python'], completed: true },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, certificate: 'Web and Computer Programming', description: 'Dive into object-oriented programming principles using C# to design robust applications.', technology: ['C#'], completed: true },
    { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: 'Add interactivity to web pages with JavaScript, creating dynamic and engaging user experiences.', technology: ['HTML', 'CSS', 'JavaScript'], completed: true },
    { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2, certificate: 'Web and Computer Programming', description: 'Master advanced frontend techniques, including responsive design and modern JavaScript frameworks.', technology: ['HTML', 'CSS', 'JavaScript'], completed: false }
];

const courseContainer = document.getElementById("courses");
const totalCreditsSpan = document.getElementById("totalCredits");
// Get the dialog element
const courseDetailsModal = document.getElementById("course-details");

function displayCourseDetails(course) {
    // Clear previous content
    courseDetailsModal.innerHTML = '';

    // Add new content to the modal
    courseDetailsModal.innerHTML = `
        <button id="closeModal">❌</button>
        <h2>${course.subject} ${course.number}</h2>
        <h3>${course.title}</h3>
        <p><strong>Credits</strong>: ${course.credits}</p>
        <p><strong>Certificate</strong>: ${course.certificate}</p>
        <p>${course.description}</p>
        <p><strong>Technologies</strong>: ${course.technology.join(', ')}</p>
    `;

    // Show the modal
    courseDetailsModal.showModal();

    // Get the close button and add event listener
    const closeModalButton = document.getElementById("closeModal");
    closeModalButton.addEventListener("click", () => {
        courseDetailsModal.close();
    });

    // Event listener to close the modal when clicking outside
    courseDetailsModal.addEventListener("click", (e) => {
        if (e.target === courseDetailsModal) { // Check if the click was directly on the backdrop
            courseDetailsModal.close();
        }
    });
}

function renderCourses(filteredCourses) {
    courseContainer.innerHTML = "";
    let total = 0;

    filteredCourses.forEach(course => {
        const card = document.createElement("div");
        card.classList.add("course-card");
        if (course.completed) card.classList.add("completed");

        card.innerHTML = `
            <h3>${course.subject} ${course.number}: ${course.title}</h3>
            <p><strong>Credits:</strong> ${course.credits}</p>
            <p>Click for details...</p> `;

        // Add click event listener to each course card
        card.addEventListener('click', () => {
            displayCourseDetails(course);
        });

        courseContainer.appendChild(card);
        total += course.credits;
    });

    totalCreditsSpan.textContent = total;
}

document.getElementById("all").addEventListener("click", () => renderCourses(courses));
document.getElementById("wdd").addEventListener("click", () => renderCourses(courses.filter(c => c.subject === "WDD")));
document.getElementById("cse").addEventListener("click", () => renderCourses(courses.filter(c => c.subject === "CSE")));

renderCourses(courses); // Initial render