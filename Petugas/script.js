document.addEventListener("DOMContentLoaded", function() {
    const filterStatus = document.getElementById("status_verifikasi");

    if(filterStatus) {
        filterStatus.addEventListener("change", function() {
            const statusDipilih = this.value;
            const laporanCards = document.querySelectorAll(".report-card");

            laporanCards.forEach(function(card) {
                const statusLaporan = card.getAttribute("data-status");

                if(statusDipilih == 'semua' || statusLaporan === statusDipilih) {
                    card.style.display = "";
                } else {
                    card.style.display = "none";
                }
            }); 
        });
    }
});