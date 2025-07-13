const courses = [
    { subject: 'CSE', number: 110, title: 'Introduction to Programming', credits: 2, certificate: 'Web and Computer Programming', description: '...', technology: ['Python'], completed: true },
    { subject: 'WDD', number: 130, title: 'Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: '...', technology: ['HTML', 'CSS'], completed: true },
    { subject: 'CSE', number: 111, title: 'Programming with Functions', credits: 2, certificate: 'Web and Computer Programming', description: '...', technology: ['Python'], completed: true },
    { subject: 'CSE', number: 210, title: 'Programming with Classes', credits: 2, certificate: 'Web and Computer Programming', description: '...', technology: ['C#'], completed: true },
    { subject: 'WDD', number: 131, title: 'Dynamic Web Fundamentals', credits: 2, certificate: 'Web and Computer Programming', description: '...', technology: ['HTML', 'CSS', 'JavaScript'], completed: true },
    { subject: 'WDD', number: 231, title: 'Frontend Web Development I', credits: 2, certificate: 'Web and Computer Programming', description: '...', technology: ['HTML', 'CSS', 'JavaScript'], completed: false }
];

const courseContainer = document.getElementById("courses");
const totalCreditsSpan = document.getElementById("totalCredits");

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
      <p>${course.description}</p>
      <p><strong>Technologies:</strong> ${course.technology.join(", ")}</p>
    `;

        courseContainer.appendChild(card);
        total += course.credits;
    });

    totalCreditsSpan.textContent = total;
}

document.getElementById("all").addEventListener("click", () => renderCourses(courses));
document.getElementById("wdd").addEventListener("click", () => renderCourses(courses.filter(c => c.subject === "WDD")));
document.getElementById("cse").addEventListener("click", () => renderCourses(courses.filter(c => c.subject === "CSE")));

renderCourses(courses); // Initial render
