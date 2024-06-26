import { z } from 'zod';
import { authedProcedure, router } from '../trpc';

export const tagsRouter = router({
  addTags: authedProcedure
    .input(z.array(z.string()))
    .mutation(async ({ ctx, input }) => {
      for (const tag of input) {
        const isNew: boolean =
          null ==
          (await ctx.db.tag.findFirst({
            where: {
              name: {
                equals: tag,
                mode: 'insensitive',
              },
            },
          }));
        if (isNew)
          await ctx.db.tag.create({ data: { name: tag.toLocaleLowerCase() } });
      }
    }),

  getAutocompleteOptions: authedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      if (input === '') return '';

      const startsWith = await ctx.db.tag.findMany({
        where: {
          name: {
            startsWith: input,
          },
        },
        select: {
          name: true,
        },
      });
      const containsNotStartsWith = await ctx.db.tag.findMany({
        where: {
          NOT: {
            name: {
              startsWith: input,
            },
          },
          AND: {
            name: {
              contains: input,
            },
          },
        },
        select: {
          name: true,
        },
      });
      return startsWith.concat(containsNotStartsWith);
    }),
});
