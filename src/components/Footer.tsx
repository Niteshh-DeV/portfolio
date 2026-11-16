import { Words } from './Kinetic';
import { scrollToTarget } from '@/utils/scroll';

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__row label">
        <span>
          © 2026 <a href="/">Nitesh Joshi</a>
        </span>
        <span>Designed &amp; developed with React &amp; TypeScript</span>
        <span>Set in Bodoni Moda &amp; Instrument Sans</span>
        <button
          type="button"
          className="label"
          onClick={() => scrollToTarget(0)}
        >
          Back to top ↑
        </button>
      </div>
      <div aria-hidden="true">
        <Words as="span" className="footer__mark" text="Nitesh *Joshi*" />
      </div>
    </footer>
  );
}
