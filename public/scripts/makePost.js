const postBtn = document.querySelector("[data-make-post-btn]");
const wraper = document.querySelector("[data-wraper]");
const btnTrue = document.querySelector("[data-btn-true]");
const btnFalse = document.querySelector("[data-btn-false]");
const inputFileContainer = document.querySelector("#imageName");

postBtn.addEventListener("click", async function (e) {
	e.preventDefault();

	const result = confirm("Post?");
	if (!result) return;

	const fd = new FormData();
	const files = inputFileContainer.files;

	if ((files.length = 0)) return;
	fd.append("image_Name", files[0]);
	console.log(files[0]);

	$.ajax({
		url: "/posts/post",
		type: "post",
		data: fd,
		contentType: false,
		processData: false,
		success: function (response) {
			if (response != 0) {
				alert("image uploaded");
			} else {
				alert("file not uploaded");
			}
		},
	});
});
