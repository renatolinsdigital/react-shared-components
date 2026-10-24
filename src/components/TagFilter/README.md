# TagFilter

A row of clickable [`Tag`](../Tag/README.md)s for filtering a list, led by a chip that clears the
filter. It holds no state: the caller keeps the active tag and does the filtering.

## Usage

```tsx
import { TagFilter } from 'react-shared-components';

const [activeTag, setActiveTag] = useState<string | null>(null);
const visiblePosts = activeTag ? posts.filter((post) => post.tags.includes(activeTag)) : posts;

<TagFilter
  tags={['Motion', 'Canvas', 'Accessibility']}
  activeTag={activeTag}
  onTagClick={setActiveTag}
  allLabel="All"
/>
```

## Props

| Prop         | Type                            | Description                                                |
| ------------ | ------------------------------- | ---------------------------------------------------------- |
| `tags`       | `string[]`                      | The tags to offer, in order.                               |
| `activeTag`  | `string \| null`                | The selected tag, or `null` for no filter.                 |
| `onTagClick` | `(tag: string \| null) => void` | Called with the clicked tag, or `null` for the first chip. |
| `allLabel`   | `string`                        | The text of the first chip, such as `"All"`.               |

All props are required.

## Notes

- The first chip is pressed while `activeTag` is `null`; each tag is pressed while it is the
  active one. Each chip reports it through `aria-pressed`.
- Clicking the active tag again keeps it active. To toggle it off, handle that in `onTagClick`.
- The row has 3rem of space below it, for the list it filters.
