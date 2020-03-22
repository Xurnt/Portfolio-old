document.addEventListener("DOMContentLoaded", function() {
  console.log("a");
  document.getElementById("loader").classList.add("startFadeOut");
  setTimeout(function() {
    document.getElementById("loader").style.display = "none";
  }, 1000);
});
