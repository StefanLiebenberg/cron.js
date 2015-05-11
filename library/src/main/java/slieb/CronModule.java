package slieb;

import com.google.inject.AbstractModule;
import com.google.inject.Key;
import com.google.inject.Provides;
import com.google.inject.multibindings.Multibinder;
import com.google.inject.name.Named;
import com.google.inject.name.Names;
import com.google.javascript.jscomp.CompilationLevel;
import com.google.javascript.jscomp.StrictWarningsGuard;
import org.slieb.tools.jspackage.internal.OptionsHandler;

public class CronModule extends AbstractModule {

    public void configure() {
        Multibinder.newSetBinder(binder(), OptionsHandler.class)
                .addBinding()
                .to(Key.get(OptionsHandler.class, Names.named("cronOptionsHandler")));
    }

    @Provides
    @Named("cronOptionsHandler")
    public OptionsHandler cronOptionsHandler() {
        CompilationLevel level = CompilationLevel.ADVANCED_OPTIMIZATIONS;
        return (opts -> {
            level.setOptionsForCompilationLevel(opts);
            level.setTypeBasedOptimizationOptions(opts);
            opts.addWarningsGuard(new StrictWarningsGuard());
        });
    }
}
