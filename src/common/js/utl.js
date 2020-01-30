function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
    let _arr = arr.slice(0)
    for (let i = 0; i < arr.length; i++) {
        let j = getRandomInt(0, i)
        let t = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = t
    }

    return _arr
}

// 截流函数
export function debounce(func, delay) {
    let timer

    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}


export function format(interval) {
    interval = interval | 0;
    let minute = (interval / 60) | 0;
    let second = interval % 60;
    let s = second < 10 ? "0" + second : second;
    return minute + ":" + s;
}