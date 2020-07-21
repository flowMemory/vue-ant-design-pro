<script>
import { checkAuthority } from "../Authority/Authority";
export default {
  functional: true,
  props: {
    authority: {
      type: Array,
      required: true
    }
  },
  render(h, context) {
    const { props, scopedSlots } = context;
    return checkAuthority(props.authority) ? scopedSlots.default() : null;
  }
};
</script>
