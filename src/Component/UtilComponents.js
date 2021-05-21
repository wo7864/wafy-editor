import styles from '../static/css/utils.module.css';

export const SpaceBetweenLayout = ({ children, align }) => {
    return (
        <div className={styles.spaceBetween}
            style={{ alignItems: align }}>
            {children}
        </div>)
}