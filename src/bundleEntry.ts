// The build entry: the public API plus the colour tokens, so `styles.css` carries both. The type
// declarations come from index.ts instead, which keeps a stylesheet import out of index.d.ts.
import './styles/tokens.scss';

export * from './index';
