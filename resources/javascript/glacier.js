$(document).ready(function() {
    getJenkinsServers();
    bindButtonEvents();
    determineStartPage();

    function determineStartPage() {
        if (localStorage.getItem("isConfigured") != "true") {
            changePage("pageContainer", "glacierConfig");
        }
        else {
            changePage("pageContainer", "glcMainUI");
        }
    }

    function bindButtonEvents() {
        $("#jnkSrvCfgFinishedButton").on("click", function() {
            changePage("pageContainer", "glcMainUI");
            localStorage.setItem("isConfigured", "true");
        })

        $("#glcMainUIMenuConfigButton").on("click", function() {
            changePage("pageContainer", "glacierConfig");
        })

        $("#glcMainUINewLookupButton").on("click", function() {
            changePage("glcMainUIDisplayPage", "glcMainUIDisplayPageNewLookup");
            resetLookup();
        })
        
        $("#glcMainUINewLookupForm").on("submit", function(e) {
            var params = $("#" + e.target.id).serializeArray();
            if (checkFormFieldsComplete(params, 3)) {
                var server = jenkinsServer.prototype.getServerById(params[0].value)[0];
                jenkinsLookup.prototype.newLookup(server, params[1].value, params[2].value);
            }
            e.preventDefault();
        })

        $(document).on("click", ".tabBar > ul > li", function(e) {
            var currentTab = e.target;
            var tabs = $(this).closest(".tabBar").children("ul").children("li");
            for (var i = 0; i < tabs.length; i++) {
                if (tabs[i] == currentTab) {
                    if (!$(tabs[i]).hasClass("tabBarSelected")) {
                        $(tabs[i]).toggleClass("tabBarSelected", true);
                    }
                    var bookId = $(tabs[i]).attr("data-bookId");
                    var pageId = $(tabs[i]).attr("data-pageId");
                    changePage(bookId, pageId);
                } else {
                    $(tabs[i]).toggleClass("tabBarSelected", false);
                }
            }
        })
    }

    function checkFormFieldsComplete(serializedParamsArray, expectedLength) {
        if (serializedParamsArray.length != expectedLength) {return false};
        for (var i = 0; i < serializedParamsArray.length; i++) {
            if (serializedParamsArray[i].value == "") {return false};
        }
        return true;
    }
});

// Use pageClass the same way as a Radio input's name; class defines the 'book', ID of each 'page' is used to identify which page you're switching to
function changePage(pageClass, pageContainerId) {
    $("." + pageClass).each(function() {
        if ($(this).attr('id') == pageContainerId) {
            $(this).removeClass('hidden');
        }
        else {
            $(this).addClass('hidden');
        }
    })
}

function resetLookup() {
    $("#glcMainUIDisplayPageNewLookupServers").empty();
    populateJenkinsServers();
    resetLookupByRadio();

    function populateJenkinsServers() {
        for (var i = 0; i < jenkinsServerArray.length; i++) {
            if (jenkinsServerArray[i].currentUser) {
                html = jenkinsServer.prototype.processTemplate($("#glcNewLookupRegionRadioTpl").html(), jenkinsServerArray[i]);
                $("#glcMainUIDisplayPageNewLookupServers").append(html);
            }
        }
    }

    function resetLookupByRadio() {
        $("#glcMainUIDisplayPageNewLookupSearchByAccNum").prop("checked", true);
        $("#glcMainUIDisplayPageNewLookupSearchByEmail").prop("checked", false);
        $("#glcMainUIDisplayPageNewLookupSearchBySiteName").prop("checked", false);
        $("#glcMainUIDisplayPageNewLookupSearchBySubNum").prop("checked", false);
        $("#glcMainUIDisplayPageNewLookupSearchByIITID").prop("checked", false);
    }
}