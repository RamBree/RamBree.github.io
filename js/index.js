// 内容自动上升
function contentMove(){
    const contentDom = document.getElementById('content');
    if (!contentDom) return;
    contentDom.classList.add('content-move');
}

// header 滚动动画
function handleHeaderScroll() {
    //为了保证兼容性，这里取两个值，哪个有值取哪一个
    //scrollTop就是触发滚轮事件时滚轮的高度
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const headerTopDom = document.getElementById('header-top');
    if (!headerTopDom) return;
    if (scrollTop > 100) {
        headerTopDom.classList.remove("header-move2");
        headerTopDom.classList.add('header-move1');
        return
    }
    headerTopDom.classList.remove('header-move1');
    headerTopDom.classList.add("header-move2");
}

function initPostToc() {
    const toc = document.getElementById('post-toc');
    const article = document.getElementById('article');
    if (!toc || !article) return;

    const headings = Array.from(article.querySelectorAll('h1[id], h2[id], h3[id], h4[id]'));
    const links = Array.from(toc.querySelectorAll('.toc-link'));
    if (!headings.length || !links.length) return;

    const linkMap = new Map();
    links.forEach((link) => {
        const href = decodeURIComponent(link.getAttribute('href') || '').replace(/^#/, '');
        if (href) linkMap.set(href, link);
    });

    const setActive = (id) => {
        links.forEach((link) => link.classList.remove('active'));
        const active = linkMap.get(id);
        if (active) active.classList.add('active');
    };

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
    }, {
        rootMargin: '-92px 0px -72% 0px',
        threshold: 0
    });

    headings.forEach((heading) => observer.observe(heading));
    if (headings[0]) setActive(headings[0].id);
}

// 在浏览器加载完成前执行
function ready ( fn ) {

	if ( document.addEventListener ) { //标准浏览器
        
		document.addEventListener( 'DOMContentLoaded', function () {
			//注销时间，避免重复触发
			document.removeEventListener( 'DOMContentLoaded', arguments.callee, false );
			fn(); //运行函数
		}, false );

	} else if ( document.attachEvent ) { //IE浏览器

		document.attachEvent( 'onreadystatechange', function () {

			if ( document.readyState == 'complete' ) {
				document.detachEvent( 'onreadystatechange', arguments.callee );
				fn(); //函数运行
			}

		} );
	}
}

// 执行动画
ready(function () {
    contentMove();
    handleHeaderScroll();
    initPostToc();
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
});
