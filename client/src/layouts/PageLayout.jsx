import PropTypes from "prop-types";

export default function PageLayout({ children, extra, ...props }) {
  return (
    <div
      className={`mt-5 mx-auto py-5 px-3 w-100 ${extra}`}
      {...props}
      style={{ maxWidth: "1536px" }}
    >
      {children}
    </div>
  );
}

PageLayout.propTypes = {
  children: PropTypes.node.isRequired,
  extra: PropTypes.string,
  props: PropTypes.object,
};
