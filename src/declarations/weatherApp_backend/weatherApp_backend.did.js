export const idlFactory = ({ IDL }) => {
  const List = IDL.Rec();
  List.fill(IDL.Opt(IDL.Tuple(IDL.Text, List)));
  return IDL.Service({
    'deleteHistory' : IDL.Func([], [List], []),
    'fetchList' : IDL.Func([], [List], []),
    'isAlreadySearch' : IDL.Func([IDL.Text], [IDL.Bool], []),
    'put' : IDL.Func([IDL.Text], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
