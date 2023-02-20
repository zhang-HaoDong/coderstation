import React from 'react'

export default function PageFooter() {
    return (
        <>
            <p className="links">
                <span className="linkItem">友情链接：</span>
                <a
                    href="https://github.com/zhang-HaoDong?tab=repositories"
                    target="_blank"
                    rel="noreferrer"
                    className="linkItem"
                >
                    GitHub
                </a>
                <a
                    target="_blank"
                    href="tencent://message/?uin=1227091229&Site=xxx&Menu=yes"
                    rel="noreferrer"
                >
                    QQ
                </a>
            </p>
            <p>© 2022 - Coder Station</p>
            <p>Powered by Create React App</p>
        </>
    )
}
