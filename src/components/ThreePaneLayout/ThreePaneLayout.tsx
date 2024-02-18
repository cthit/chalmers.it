import style from './ThreePaneLayout.module.scss';

const ThreePaneLayout = ({left, right, middle}: {left?: React.ReactNode, right?: React.ReactNode, middle: React.ReactNode}) => {
    return (<div className={style.main}>
        <div className={style.side}>{left}</div>
        <div className={style.middle}>{middle}</div>
        <div className={style.side}>{right}</div>
    </div>);
}

export default ThreePaneLayout;
