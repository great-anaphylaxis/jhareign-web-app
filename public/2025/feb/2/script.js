const progress = document.getElementById('progress');
const hint = document.getElementById('hint');

var value, max;

function init() {
    [value, max] = getParams();

    updateContent();
}

function getParams() {
    const url = new URL(location.href);
    const params = url.searchParams.get('v').split("/");
    
    return [params[0], params[1]];
}

function updateContent() {
    const percent = parseInt((value/max) * 100);

    progress.value = value;
    progress.max = max;

    hint.textContent = `${percent}%`;
}

init();