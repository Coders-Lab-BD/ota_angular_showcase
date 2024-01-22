interface YearDropdownPluginConfig {
    text: string;
    theme: string;
    date: Date;
    yearStart: number;
    yearEnd: number;
}

const yearDropdownPlugin = function ({
    text = "",
    theme = "light",
    date = new Date(),
    yearStart = 100,
    yearEnd = 2,
} = {}) {
    const config: YearDropdownPluginConfig = {
        text,
        theme,
        date,
        yearStart,
        yearEnd,
    };

    const getYear = function (value: Date) {
        const d = value.toString().split("/");
        return parseInt(d[2], 10);
    };

    const currYear = config.date.getFullYear();
    
    const selectedYear = getYear(config.date);

    const yearDropdown = document.createElement("select");

    const createSelectElement = function (year: number) {
        const start = config.date.getFullYear() - config.yearStart;
        const end = currYear + config.yearEnd;

        for (let i = start; i <= end; i++) {
            const option = document.createElement("option");
            option.value = i.toString();
            option.text = i.toString();
            yearDropdown.appendChild(option);
        }
        setTimeout(() => {
            const selectedY = config.date.getFullYear();
            const defaultYear = selectedY;
            const selectedOption = yearDropdown.querySelector(`option[value="${defaultYear}"]`) as HTMLOptionElement | null;
            if (selectedOption) {
                selectedOption.selected = true;
            }
    
            yearDropdown.value = defaultYear.toString();
        }, 0);
    };

    return function (fp: any) {
        fp.yearSelectContainer = fp._createElement(
            "div",
            "flatpickr-year-select " + config.theme + "Theme",
            config.text
        );

        fp.yearSelectContainer.tabIndex = -1;
        createSelectElement(selectedYear);
        yearDropdown.addEventListener("change", function (evt) {
            const target = evt.target as HTMLSelectElement;
            const year = target.options[target.selectedIndex].value;
            fp.changeYear(year);
        });
        fp.yearSelectContainer.append(yearDropdown);
        
        return {
            onReady: function onReady() {
                const name = fp.monthNav.className;
                const yearInputCollection = fp.calendarContainer.getElementsByClassName(name);
                const el = yearInputCollection[0];
                el.parentNode.insertBefore(fp.yearSelectContainer, el.parentNode.firstChild);
            },
        };
    };
};

export default yearDropdownPlugin;