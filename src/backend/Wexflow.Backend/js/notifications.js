﻿window.onload = function () {
    "use strict";

    let updateLanguage = function (language) {
        document.getElementById("lnk-records").innerHTML = language.get("lnk-records");
        document.getElementById("lnk-approval").innerHTML = language.get("lnk-approval");

        document.getElementById("lnk-dashboard").innerHTML = language.get("lnk-dashboard");
        document.getElementById("lnk-manager").innerHTML = language.get("lnk-manager");
        document.getElementById("lnk-designer").innerHTML = language.get("lnk-designer");
        document.getElementById("lnk-history").innerHTML = language.get("lnk-history");
        document.getElementById("lnk-users").innerHTML = language.get("lnk-users");
        document.getElementById("lnk-profiles").innerHTML = language.get("lnk-profiles");
        document.getElementById("spn-logout").innerHTML = language.get("spn-logout");
    };

    let language = new Language("lang", updateLanguage);
    language.init();

    let uri = Common.trimEnd(Settings.Uri, "/");
    let lnkRecords = document.getElementById("lnk-records");
    let lnkManager = document.getElementById("lnk-manager");
    let lnkDesigner = document.getElementById("lnk-designer");
    let lnkApproval = document.getElementById("lnk-approval");
    let lnkUsers = document.getElementById("lnk-users");
    let lnkProfiles = document.getElementById("lnk-profiles");
    let lnkNotifications = document.getElementById("lnk-notifications");
    let imgNotifications = document.getElementById("img-notifications");
    let searchText = this.document.getElementById("search-notifications");
    let username = "";
    let auth = "";

    let suser = getUser();

    if (suser === null || suser === "") {
        Common.redirectToLoginPage();
    } else {
        let user = JSON.parse(suser);

        username = user.Username;
        let password = user.Password;
        auth = "Basic " + btoa(username + ":" + password);

        Common.get(uri + "/user?username=" + encodeURIComponent(user.Username),
            function (u) {
                if (user.Password !== u.Password) {
                    Common.redirectToLoginPage();
                } else {
                    if (u.UserProfile === 0 || u.UserProfile === 1) {
                        Common.get(uri + "/hasNotifications?a=" + encodeURIComponent(user.Username), function (hasNotifications) {
                            lnkRecords.style.display = "inline";
                            lnkManager.style.display = "inline";
                            lnkDesigner.style.display = "inline";
                            lnkApproval.style.display = "inline";
                            lnkUsers.style.display = "inline";
                            lnkNotifications.style.display = "inline";

                            if (u.UserProfile === 0) {
                                lnkProfiles.style.display = "inline";
                            }

                            if (hasNotifications === true) {
                                imgNotifications.src = "images/notification-active.png";
                            } else {
                                imgNotifications.src = "images/notification.png";
                            }

                            let btnLogout = document.getElementById("btn-logout");
                            document.getElementById("navigation").style.display = "block";
                            document.getElementById("content").style.display = "block";

                            btnLogout.onclick = function () {
                                deleteUser();
                                Common.redirectToLoginPage();
                            };
                            document.getElementById("spn-username").innerHTML = " (" + u.Username + ")";

                            searchText.onkeyup = function (event) {
                                event.preventDefault();

                                if (event.keyCode === 13) { // Enter
                                    loadNotifications();
                                }

                                return false;
                            };

                            loadNotifications();

                        }, function () { }, auth);
                    } else {
                        Common.redirectToLoginPage();
                    }

                }
            }, function () { }, auth);

        function loadNotifications() {
            Common.get(uri + "/searchNotifications?a=" + encodeURIComponent(user.Username) + "&s=" + encodeURIComponent(searchText.value), function (notifications) {

                let items = [];
                for (let i = 0; i < notifications.length; i++) {
                    let notification = notifications[i];
                    items.push("<tr>"
                        + "<td class='check'><input type='checkbox'></td>"
                        + "<td class='id'>" + notification.Id + "</td>"
                        + "<td class='assigned-by " + (notification.IsRead === false ? "bold" : "") + "'>" + notification.AssignedBy + "</td>"
                        + "<td class='assigned-on " + (notification.IsRead === false ? "bold" : "") + "'>" + notification.AssignedOn + "</td>"
                        + "<td class='message " + (notification.IsRead === false ? "bold" : "") + "'>" + notification.Message + "</td>"
                        + "</tr>");

                }

                let table = "<table id='notifications-table' class='table'>"
                    + "<thead class='thead-dark'>"
                    + "<tr>"
                    + "<th class='check'><input id='check-all' type='checkbox'></th>"
                    + "<th class='id'></th>"
                    + "<th id='th-assigned-by' class='assigned-by'>" + "Assigned by" + "</th>"
                    + "<th id='th-assigned-on' class='assigned-on'>" + "Assigned on" + "</th>"
                    + "<th id='th-message' class='message'>" + "Message" + "</th>"
                    + "</tr>"
                    + "</thead>"
                    + "<tbody>"
                    + items.join("")
                    + "</tbody>"
                    + "</table>";

                let divNotifications = document.getElementById("content");
                divNotifications.innerHTML = table;

                let notificationsTable = document.getElementById("notifications-table");
                let rows = notificationsTable.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
                let notificationIds = [];
                for (let i = 0; i < rows.length; i++) {
                    let row = rows[i];
                    let checkBox = row.getElementsByClassName("check")[0].firstChild;
                    checkBox.onchange = function () {
                        let currentRow = this.parentElement.parentElement;
                        let notificationId = currentRow.getElementsByClassName("id")[0].innerHTML;
                        if (this.checked === true) {
                            notificationIds.push(notificationId);
                        } else {
                            notificationIds = Common.removeItemOnce(notificationIds, notificationId);
                        }
                    };
                }

                document.getElementById("btn-mark-as-read").onclick = function () {
                    Common.post(uri + "/markNotificationsAsRead", function (res) {
                        if (res === true) {
                            Common.get(uri + "/hasNotifications?a=" + encodeURIComponent(user.Username), function (hasNotifications) {
                                for (let i = 0; i < notificationIds.length; i++) {
                                    let notificationId = notificationIds[i];
                                    for (let j = 0; j < rows.length; j++) {
                                        let row = rows[j];
                                        let id = row.getElementsByClassName("id")[0].innerHTML;
                                        if (notificationId === id) {
                                            row.getElementsByClassName("assigned-by")[0].classList.remove("bold");
                                            row.getElementsByClassName("assigned-on")[0].classList.remove("bold");
                                            row.getElementsByClassName("message")[0].classList.remove("bold");

                                            // Notify assignedBy
                                            //for (let k = 0; k < notifications.length; k++) {
                                            //    let notification = notifications[k];
                                            //    if (notificationId === notification.Id) {

                                            //        let message = "The user " + username + " has read his notification: " + notification.Message;
                                            //        Common.post(uri + "/notify?a=" + encodeURIComponent(notification.AssignedBy) + "&m=" + encodeURIComponent(message), function (notifyRes) {
                                            //            if (notifyRes === true) {
                                            //                Common.toastInfo("The assignor was notified that you read the notifictaion assigned on " + notification.AssignedOn + ".");
                                            //            } else {
                                            //                Common.toastError("An error occured while notifying the assignor.");
                                            //            }
                                            //        }, function () { }, "", auth);

                                            //        break;
                                            //    }
                                            //}
                                        }
                                    }

                                    if (hasNotifications === true) {
                                        imgNotifications.src = "images/notification-active.png";
                                    } else {
                                        imgNotifications.src = "images/notification.png";
                                    }
                                }
                            }, function () { }, auth);
                        }
                    }, function () { }, notificationIds, auth);
                };

                document.getElementById("btn-mark-as-unread").onclick = function () {
                    Common.post(uri + "/markNotificationsAsUnread", function (res) {
                        if (res === true) {
                            Common.get(uri + "/hasNotifications?a=" + encodeURIComponent(user.Username), function (hasNotifications) {
                                for (let i = 0; i < notificationIds.length; i++) {
                                    let notificationId = notificationIds[i];
                                    for (let j = 0; j < rows.length; j++) {
                                        let row = rows[j];
                                        let id = row.getElementsByClassName("id")[0].innerHTML;
                                        if (notificationId === id) {
                                            if (row.getElementsByClassName("assigned-by")[0].classList.contains("bold") === false) {
                                                row.getElementsByClassName("assigned-by")[0].classList.add("bold");
                                            }
                                            if (row.getElementsByClassName("assigned-on")[0].classList.contains("bold") === false) {
                                                row.getElementsByClassName("assigned-on")[0].classList.add("bold");
                                            }
                                            if (row.getElementsByClassName("message")[0].classList.contains("bold") === false) {
                                                row.getElementsByClassName("message")[0].classList.add("bold");
                                            }
                                        }
                                    }

                                    if (hasNotifications === true) {
                                        imgNotifications.src = "images/notification-active.png";
                                    } else {
                                        imgNotifications.src = "images/notification.png";
                                    }
                                }
                            }, function () { }, auth);
                        }
                    }, function () { }, notificationIds, auth);
                };

                document.getElementById("btn-delete").onclick = function () {
                    if (notificationIds.length === 0) {
                        Common.toastInfo("Select notifications to delete.");
                    } else {
                        let cres = confirm("Are you sure you want to delete " + (notificationIds.length == 1 ? "this" : "these") + " notification" + (notificationIds.length == 1 ? "" : "s") + "?");
                        if (cres === true) {
                            Common.post(uri + "/deleteNotifications", function (res) {
                                if (res === true) {
                                    for (let i = notificationIds.length - 1; i >= 0; i--) {
                                        let notificationId = notificationIds[i];
                                        for (let j = 0; j < rows.length; j++) {
                                            let row = rows[j];
                                            let id = row.getElementsByClassName("id")[0].innerHTML;
                                            if (notificationId === id) {
                                                notificationIds = Common.removeItemOnce(notificationIds, notificationId);
                                                row.remove();

                                                // Notify assignedBy
                                                //for (let k = 0; k < notifications.length; k++) {
                                                //    let notification = notifications[k];
                                                //    if (notificationId === notification.Id) {

                                                //        let message = "The user " + username + " has read his notification: " + notification.Message;
                                                //        Common.post(uri + "/notify?a=" + encodeURIComponent(notification.AssignedBy) + "&m=" + encodeURIComponent(message), function (notifyRes) {
                                                //            if (notifyRes === true) {
                                                //                Common.toastInfo("The assignor was notified that you read the notifictaion assigned on " + notification.AssignedOn + ".");
                                                //            } else {
                                                //                Common.toastError("An error occured while notifying the assignor.");
                                                //            }
                                                //        }, function () { }, "", auth);

                                                //        break;
                                                //    }
                                                //}

                                            }
                                        }
                                    }
                                }
                            }, function () { }, notificationIds, auth);
                        }
                    }
                };

                document.getElementById("check-all").onchange = function () {
                    for (let i = 0; i < rows.length; i++) {
                        let row = rows[i];
                        let checkBox = row.getElementsByClassName("check")[0].firstChild;
                        let notificationId = row.getElementsByClassName("id")[0].innerHTML;

                        if (checkBox.checked === true) {
                            checkBox.checked = false;
                            notificationIds = Common.removeItemOnce(notificationIds, notificationId);
                        } else {
                            checkBox.checked = true;
                            notificationIds.push(notificationId);
                        }
                    }
                };

            }, function () { }, auth);
        }
    }

};