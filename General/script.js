(function () {
    "use strict";

    var LoginModule = (function () {
        var form = null;
        var alertBox = null;
        var alertMessage = null;
        var passwordInput = null;
        var passwordToggle = null;

        var INVALID_CREDENTIALS_MESSAGE = "NIK atau Password salah";

        function isValidNik(value) {
            return /^\d{16}$/.test(value.trim());
        }

        function isValidPassword(value) {
            return value.length >= 8;
        }

        function showAlert(message, type) {
            alertMessage.textContent = message;
            alertBox.classList.remove("alert-error", "alert-success");
            alertBox.classList.add(type === "success" ? "alert-success" : "alert-error");
            alertBox.hidden = false;
        }

        function hideAlert() {
            alertBox.hidden = true;
            alertMessage.textContent = "";
        }

        function initPasswordToggle() {
            passwordToggle.addEventListener("click", function () {
                var isVisible = passwordInput.type === "text";
                passwordInput.type = isVisible ? "password" : "text";
                passwordToggle.setAttribute("aria-pressed", String(!isVisible));
                passwordToggle.setAttribute(
                    "aria-label",
                    isVisible ? "Tampilkan password" : "Sembunyikan password"
                );
            });
        }

        function collectCredentials() {
            var data = new FormData(form);
            return {
                nik: String(data.get("nik") || "").trim(),
                password: String(data.get("password") || "")
            };
        }

        function submitLogin(credentials) {
            /* Ganti bagian ini dengan fetch() ke Spring Boot, contoh:
               return fetch("/api/auth/login", {
                   method: "POST",
                   headers: { "Content-Type": "application/json" },
                   body: JSON.stringify(credentials)
               }).then(function (res) { return res.json(); }); */
            return new Promise(function (resolve) {
                setTimeout(function () {
                    resolve({ success: true, redirectUrl: "../Warga/index.html" });
                }, 600);
            });
        }

        function setSubmitLoading(isLoading) {
            var submitButton = form.querySelector(".submit");
            submitButton.disabled = isLoading;
            submitButton.textContent = isLoading ? "Memproses..." : "Masuk";
        }

        function initFormSubmit() {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                hideAlert();

                var nikInput = document.getElementById("nik");
                var nikValid = isValidNik(nikInput.value);
                var passwordValid = isValidPassword(passwordInput.value);

                if (!nikValid || !passwordValid) {
                    showAlert(INVALID_CREDENTIALS_MESSAGE, "error");
                    (nikValid ? passwordInput : nikInput).focus();
                    return;
                }

                setSubmitLoading(true);

                submitLogin(collectCredentials())
                    .then(function (response) {
                        if (response && response.success) {
                            showAlert("Berhasil masuk. Mengalihkan...", "success");
                            if (response.redirectUrl) {
                                window.location.href = response.redirectUrl;
                            }
                        } else {
                            showAlert(
                                (response && response.message) || INVALID_CREDENTIALS_MESSAGE,
                                "error"
                            );
                        }
                    })
                    .catch(function () {
                        showAlert("Tidak dapat terhubung ke server. Coba lagi nanti.", "error");
                    })
                    .finally(function () {
                        setSubmitLoading(false);
                    });
            });
        }

        function init() {
            form = document.getElementById("login-form");
            alertBox = document.getElementById("login-alert");
            alertMessage = document.getElementById("login-alert-message");
            passwordInput = document.getElementById("password");
            passwordToggle = document.getElementById("password-toggle");

            if (!form || !alertBox || !passwordInput || !passwordToggle) return;

            var serverError = alertBox.getAttribute("data-error");
            if (serverError) {
                showAlert(serverError, "error");
            }

            initPasswordToggle();
            initFormSubmit();
        }

        return { init: init };
    })();

    document.addEventListener("DOMContentLoaded", LoginModule.init);
})();
