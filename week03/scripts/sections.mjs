function setSectionSelection() {
    const sectionSelect = document.querySelector("#sectionNumber");
    byuiCourse.sections.forEach((section) => {
        const option = document.createElement("option");
        option.value = section.sectionNumber;
        option.textContent = `${section.sectionNumber}`;
        sectionSelect.appendChild(option);
    });
}
export function populateSections(sections) { // Note the 'sections' parameter needed for importing byuiCourse.sections
    const sectionSelect = document.querySelector("#sectionNumber");
    sectionSelect.innerHTML = ""; // Clear existing options (good practice for re-rendering)
    sections.forEach((section) => {
        const option = document.createElement("option");
        option.value = section.sectionNumber;
        option.textContent = `${section.sectionNumber}`;
        sectionSelect.appendChild(option);
    });
}