const contactMe = () => {
  const rightPanel = document.getElementById("right-main-container");
  if (!rightPanel.classList.contains("active")) {
    rightPanel.classList.add("active");
  }
};
