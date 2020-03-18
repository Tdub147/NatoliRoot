/**
 * Occurs when document is ready
 */
$(document).ready(function () {
    includeHTML();
})
$(document).ready(function () {
    
})
/**
 * Occurs on window resizing
 */
$(window).resize(function() {
    MenuRedraw();
  });

function openMenu(){
    //$("#menu-drop").slideDown(300);
    //$("#menu-drop").slideUp(300);
    document.getElementById("menu-closed").classList.toggle("highlight");
}

/**
 * Refreshes the page.
 * @return {void} void
 * */
function RefreshPage() {
    location.reload();
    return false;
}

/**
 * Closes all select dropdowns that are not the one selected.
 * @param {Element} elmnt - The element sourcing the event
 * @return {void} void
 * */
function closeAllSelect(elmnt) {
    var x, y, i, otherParents, parent;
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    if (
        elmnt != undefined &&
        elmnt.tagName == "DIV" &&
        elmnt.parentElement != undefined &&
        elmnt.parentElement.classList.contains("select-parent")
    ) {
        parent = elmnt.parentElement;
        parent.classList.toggle("opened");
        parent.children[1].classList.toggle("select-arrow-active");
        parent.children[2].classList.toggle("select-hide");
    } else {
        otherParents = document.getElementsByClassName("select-parent");
        for (i = 0; i < otherParents.length; i++) {
            if (otherParents[i] != parent) {
                otherParents[i].classList.remove("opened");
                otherParents[i].children[1].classList.remove("select-arrow-active");
                otherParents[i].children[2].classList.add("select-hide");
            }
        }
    }
}
/**
 * Configures the rest of the Select (Dropdown).
 * Drives selected-item's innerHTML to match the Select input's.
 * Adds event listeners.
 * @return {void} void
 * */
function styleDropDowns() {
    var parent, x, i, j, selElmnt, a, b, c;
    // Look for any elements with the class "select-parent":
    x = document.getElementsByClassName("select-parent");
    for (i = 0; i < x.length; i++) {
        parent = x[i];
        selElmnt = parent.children[0];
        a = parent.children[1];
        b = parent.children[2];
        // Set a to have the text of the selected item.
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        var offset = 1;
        if (selElmnt.id.startsWith("pm")) {
            offset = 0;
        }
        for (j = offset; j < selElmnt.length; j++) {
            c = b.children[j - offset];
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.addEventListener("click", function (e) {
                // When an item is clicked, update the original select box, and the selected item:
                var y, i, k, selElmnt, a, parent, b;
                parent = this.parentElement.parentElement;
                selElmnt = parent.children[0];
                a = parent.children[1];
                b = parent.children[2];
                for (i = 0; i < selElmnt.length; i++) {
                    if (selElmnt.options[i].innerHTML == this.innerHTML) {
                        selElmnt.selectedIndex = i;
                        a.innerHTML = this.innerHTML;
                        y = b.getElementsByClassName("same-as-selected");
                        for (k = 0; k < y.length; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                a.click();
            });
        }
    }
}

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {elmnt.innerHTML = this.responseText;}
          if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
    }
    MenuRedraw();
    $(document.getElementById("dropMenu")).fadeOut(0);
}
/**
 * Header - hides drop menu
 */
function hideMenu(){
    var dropMenu = document.getElementById("dropMenu");
    $(dropMenu).fadeOut(100);
}
/**
 * Header - shows drop menu
 */
function showMenu(){
    var dropMenu = document.getElementById("dropMenu");
    $(dropMenu).fadeIn(100);
}
/**
 * Header - toggles drop menu and hamburger icon
 */
function menuClick(){
    var dropMenu = document.getElementById("dropMenu");
    var burgerMenu = document.getElementById("burgerMenu");
    $(dropMenu).fadeToggle(100);
    var opacity = dropMenu.style.opacity;
    if(opacity<.5){
        burgerMenu.attributes.getNamedItem('src').value="../icons/969595-essentials/svg/031-cancel.svg";
    }
    else{
        burgerMenu.attributes.getNamedItem('src').value="../icons/969595-essentials/svg/019-menu-1.svg";
    }
}
/**
 * Header - chooses whether to have text or burgermenu
 */
function MenuRedraw() {
    var textMenu = document.getElementById("textMenu");
    var burgerMenu = document.getElementById("burgerMenu");
    if ($(this).width() < 820) {
        textMenu.hidden = true;
        burgerMenu.hidden = false;
    } else {
        burgerMenu.hidden = true;
        textMenu.hidden = false;
      }
}
